package com.yuan.service.impl;

import com.yuan.constant.MessageConstant;
import com.yuan.constant.StatusConstant;
import com.yuan.dto.ComboDTO;
import com.yuan.dto.ComboItemDTO;
import com.yuan.dto.ComboPageQueryDTO;
import com.yuan.entity.Category;
import com.yuan.entity.Combo;
import com.yuan.entity.Combos;
import com.yuan.entity.MenuItem;
import com.yuan.repository.CategoryRepository;
import com.yuan.repository.CombosRepository;
import com.yuan.repository.ComboRepository;
import com.yuan.repository.MenuItemRepository;
import com.yuan.result.PageResult;
import com.yuan.service.ComboService;
import com.yuan.vo.ComboItemVO;
import com.yuan.vo.ComboVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class ComboServiceImpl implements ComboService {
    private final ComboRepository comboRepository;
    private final CategoryRepository categoryRepository;
    private final CombosRepository combosRepository;
    private final MenuItemRepository menuItemRepository;
    private final S3Service s3Service;

    @Override
    @Transactional
    public Combo addCombo(ComboDTO comboDTO) {
        return addCombo(comboDTO, null);
    }

    @Override
    @Transactional
    public Combo addCombo(ComboDTO comboDTO, MultipartFile imageFile) {
        Optional<Combo> existing = comboRepository.findByName(comboDTO.getName());
        if (existing.isPresent()) {
            throw new IllegalArgumentException(MessageConstant.ALREADY_EXISTS);
        }

        Combo combo = new Combo();
        BeanUtils.copyProperties(comboDTO, combo);
        combo.setStatus(StatusConstant.DISABLE);
        combo.setCategoryId(11L);

        // Handle image upload if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = s3Service.uploadFile(imageFile);
            combo.setImage(imageUrl);
        } else if (comboDTO.getImage() != null && !comboDTO.getImage().isEmpty()) {
            // Handle case where image is passed as URL string
            combo.setImage(comboDTO.getImage());
        }

        Combo savedCombo = comboRepository.save(combo);

        // Save menu items if provided
        List<ComboItemDTO> items = comboDTO.getItems();
        if (items != null && !items.isEmpty()) {
            for (ComboItemDTO item : items) {
                Long itemId = item.getId();
                Integer quantity = item.getQuantity() != null ? item.getQuantity() : 1;

                Combos combos = new Combos(null, savedCombo.getId(), itemId, quantity);
                combosRepository.save(combos);
            }
        }

        return savedCombo;
    }

    @Override
    @Transactional
    public void deleteCombo(Long id) {
        if (id == null ) {
            throw new IllegalArgumentException(MessageConstant.ACCOUNT_NOT_FOUND);
        }

        // Find the combo to get image URL before deletion
        Combo combo = comboRepository.findById(id).orElse(null);
        if (combo != null && combo.getImage() != null && !combo.getImage().isEmpty()) {
            try {
                // Delete image from S3
                s3Service.deleteFile(combo.getImage());
                log.info("Deleted combo image from S3: {}", combo.getImage());
            } catch (Exception e) {
                log.error("Failed to delete combo image from S3: {}", combo.getImage(), e);
                // Continue with deletion even if image deletion fails
            }
        }

        // Delete associated menu items first
        combosRepository.deleteByComboId(id);
        // Delete combos
        comboRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void changeComboStatus(Long id, Integer status) {
        Combo combo = comboRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Combo not found: " + id));

        combo.setStatus(status);
        comboRepository.save(combo);
    }


    @Override
    @Transactional
    public Combo updateCombo(ComboDTO comboDTO, MultipartFile imageFile) {
        if (comboDTO == null || comboDTO.getId() == null) {
            throw new IllegalArgumentException("DTO or ID cannot be null");
        }
        log.info("开始更新combo:{}",comboDTO.toString());

        Combo combo = comboRepository.findById(comboDTO.getId())
                .orElseThrow(() -> new RuntimeException("Combo not found: " + comboDTO.getId()));

        // Handle image update
        String oldImageUrl = combo.getImage();

        // If new image file is provided, upload it and delete old image
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String newImageUrl = s3Service.uploadFile(imageFile);
                combo.setImage(newImageUrl);

                // Delete old image from S3 if it exists
                if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
                    s3Service.deleteFile(oldImageUrl);
                    log.info("Deleted old combo image from S3: {}", oldImageUrl);
                }
            } catch (Exception e) {
                log.error("Failed to upload new combo image", e);
                throw new RuntimeException("Failed to upload image: " + e.getMessage());
            }
        } else {
            // Handle image based on DTO properties
            if (comboDTO.getImageChanged() != null && comboDTO.getImageChanged()) {
                // Image was marked as changed in frontend
                if (comboDTO.getImage() == null || comboDTO.getImage().isEmpty()) {
                    // Image was removed
                    if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
                        try {
                            s3Service.deleteFile(oldImageUrl);
                            log.info("Deleted combo image from S3: {}", oldImageUrl);
                        } catch (Exception e) {
                            log.error("Failed to delete combo image from S3: {}", oldImageUrl, e);
                        }
                    }
                    combo.setImage("");
                } else if (comboDTO.getHasExistingImage() == null || !comboDTO.getHasExistingImage()) {
                    // New image URL provided (not existing one)
                    combo.setImage(comboDTO.getImage());
                }
            } else {
                // No image change, keep existing image unless new URL provided
                if (comboDTO.getImage() != null && !comboDTO.getImage().isEmpty()) {
                    combo.setImage(comboDTO.getImage());
                }
            }
        }

        // Copy other properties
        BeanUtils.copyProperties(comboDTO, combo, "image"); // Skip image since we handled it above

        // Delete existing combos associated with menu items
        List<Combos> oldCombos = combosRepository.findByComboId(combo.getId());
        if (oldCombos !=null && !oldCombos.isEmpty()){
            combosRepository.deleteByComboId(combo.getId());
        }

        // Process items - handle ComboItemDTO structure
        List<ComboItemDTO> items = comboDTO.getItems();

        log.info("Processing update for combo {}: received {} items", combo.getId(),
                items != null ? items.size() : "null");

        if (items != null && !items.isEmpty()) {
            log.info("Creating combos records for {} menu items", items.size());
            items.forEach(item -> {
                Long itemId = item.getId();
                Integer quantity = item.getQuantity() != null ? item.getQuantity() : 1;

                log.debug("Creating combo record: combo_id={}, menu_item_id={}, quantity={}", combo.getId(), itemId, quantity);
                Combos combos = new Combos(null, combo.getId(), itemId, quantity);
                combosRepository.save(combos);
            });
            log.info("Successfully created {} combos records", items.size());
        } else {
            log.warn("No items provided for combo update: {}", combo.getId());
        }

        return comboRepository.save(combo);
    }

    @Override
    public ComboVO getComboById(Long id) {
        Combo combo = comboRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Combo not found: " + id));

        Category category = categoryRepository.findById(combo.getCategoryId())
                .orElse(null);

        List<Combos> combos = combosRepository.findByComboId(id);

        // Convert combos to ComboItemVO with menu item details
        List<ComboItemVO> items = combos.stream().map(comboItem -> {
            try {
                MenuItem menuItem = menuItemRepository.findById(comboItem.getMenuItemId())
                        .orElse(null);
                if (menuItem != null) {
                    return new ComboItemVO(
                        comboItem.getId(),
                        comboItem.getMenuItemId(),
                        menuItem.getName(),
                        menuItem.getPrice(),
                        menuItem.getImage(),
                        comboItem.getQuantity() != null ? comboItem.getQuantity() : 1
                    );
                }
                return null;
            } catch (Exception e) {
                log.error("Error loading menu item for combo item: " + comboItem.getMenuItemId(), e);
                return null;
            }
        }).filter(item -> item != null).collect(Collectors.toList());

        return new ComboVO(
                combo.getId(),
                combo.getName(),
                combo.getCategoryId(),
                category != null ? category.getName() : "Unknown",
                combo.getPrice(),
                combo.getImage(),
                combo.getDescription(),
                combo.getStatus(),
                combo.getUpdateTime(),
                items
        );
    }

    @Override
    public List<Combo> findAll() {
        try {
            return comboRepository.findAll();
        } catch (Exception e) {
            log.error("Failed to find combos", e);
            throw new RuntimeException("Failed to retrieve combos: " + e.getMessage());
        }
    }


    @Override
    public PageResult findAllWithCategory(ComboPageQueryDTO dto) {
        if (dto == null) {
            dto = new ComboPageQueryDTO();
        }

        Pageable pageable = PageRequest.of(
                dto.getPage() - 1,
                dto.getPageSize(),
                Sort.by(Sort.Direction.DESC, "updateTime")
        );

        Page<Combo> page = comboRepository.findAllWithCategory(
                dto.getName(),
                dto.getCategoryId(),
                dto.getStatus(),
                pageable
        );

        // Map category name and id
        Map<Long, String> categoryMap = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getId, Category::getName));

        // Convert to combo VO
        List<ComboVO> voList = page.getContent().stream()
                .map(combo -> {
                    List<Combos> combos = combosRepository.findByComboId(combo.getId());
                    // Convert Combos to ComboItemVO
                    List<ComboItemVO> items = combos.stream()
                            .map(comboRel -> {
                                try {
                                    MenuItem menuItem = menuItemRepository.findById(comboRel.getMenuItemId()).orElse(null);
                                    if (menuItem != null) {
                                        return new ComboItemVO(
                                                comboRel.getId(),
                                                comboRel.getMenuItemId(),
                                                menuItem.getName(),
                                                menuItem.getPrice(),
                                                menuItem.getImage(),
                                                comboRel.getQuantity() != null ? comboRel.getQuantity() : 1
                                        );
                                    }
                                    return null;
                                } catch (Exception e) {
                                    log.error("Error finding menu item for combo relation: {}", comboRel.getMenuItemId(), e);
                                    return null;
                                }
                            })
                            .filter(item -> item != null)
                            .collect(Collectors.toList());

                    return new ComboVO(
                            combo.getId(),
                            combo.getName(),
                            combo.getCategoryId(),
                            categoryMap.getOrDefault(combo.getCategoryId(), "Unknown"),
                            combo.getPrice(),
                            combo.getImage(),
                            combo.getDescription(),
                            combo.getStatus(),
                            combo.getUpdateTime(),
                            items
                    );
                })
                .toList();

        return new PageResult(page.getTotalElements(), voList);
    }


    @Override
    public List<Map<String, Object>> searchMenuItems(String query) {
        try {
            log.info("Searching menu items with query: {}", query);
            // Search menu items by name with fuzzy matching
            List<MenuItem> menuItems = menuItemRepository.findByNameContainingIgnoreCaseAndStatus(query, 1);

            return menuItems.stream()
                    .map(item -> {
                        Map<String, Object> result = new java.util.HashMap<>();
                        result.put("id", item.getId());
                        result.put("name", item.getName());
                        result.put("price", item.getPrice());
                        result.put("image", item.getImage());
                        result.put("categoryId", item.getCategoryId());
                        result.put("description", item.getDescription());
                        return result;
                    })
                    .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to search menu items", e);
            throw new RuntimeException("Failed to search menu items: " + e.getMessage());
        }
    }


}