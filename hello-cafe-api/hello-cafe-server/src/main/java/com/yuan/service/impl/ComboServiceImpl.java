package com.yuan.service.impl;

import com.yuan.constant.MessageConstant;
import com.yuan.constant.StatusConstant;
import com.yuan.dto.ComboDTO;
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
        Optional<Combo> existing = comboRepository.findByName(comboDTO.getName());
        if (existing.isPresent()) {
            throw new IllegalArgumentException(MessageConstant.ALREADY_EXISTS);
        }

        Combo combo = new Combo();
        BeanUtils.copyProperties(comboDTO, combo);
        combo.setStatus(StatusConstant.DISABLE);

        Combo savedCombo = comboRepository.save(combo);

        // Save combo items if provided
        List<Combos> combos = comboDTO.getCombos();
        if (combos != null && !combos.isEmpty()) {
            for (Combos item : combos) {
                item.setComboId(savedCombo.getId());
                // Set default values if not provided
                if (item.getQuantity() == null) {
                    item.setQuantity(1);
                }
                // Set name from MenuItem if not provided
                if (item.getName() == null && item.getMenuItemId() != null) {
                    MenuItem menuItem = menuItemRepository.findById(item.getMenuItemId())
                            .orElseThrow(() -> new IllegalArgumentException("Menu item not found: " + item.getMenuItemId()));
                    item.setName(menuItem.getName());
                    item.setPrice(menuItem.getPrice());
                }
                combosRepository.save(item);
            }
        }

        return savedCombo;
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
                            combos
                    );
                })
                .toList();

        return new PageResult(page.getTotalElements(), voList);
    }

    @Override
    @Transactional
    public void deleteCombos(List<Long> idList) {
        if (idList == null || idList.isEmpty()) {
            throw new IllegalArgumentException(MessageConstant.ACCOUNT_NOT_FOUND);
        }

        // Delete associated combo items first
        for (Long comboId : idList) {
            // Delete combo items and associated images
            List<Combos> combos = combosRepository.findByComboId(comboId);
            for (Combos item : combos) {
                // If menu items have images, delete them from S3
                // Note: This assumes ComboItem might have an image field
                // You may need to adjust based on your actual data model
            }
            combosRepository.deleteByComboId(comboId);
        }

        // Delete combos
        comboRepository.deleteAllByIdInBatch(idList);
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
    public Combo updateCombo(ComboDTO comboDTO) {
        if (comboDTO == null || comboDTO.getId() == null) {
            throw new IllegalArgumentException("DTO or ID cannot be null");
        }

        Combo combo = comboRepository.findById(comboDTO.getId())
                .orElseThrow(() -> new RuntimeException("Combo not found: " + comboDTO.getId()));

        BeanUtils.copyProperties(comboDTO, combo);

        // Delete existing combo items
        combosRepository.deleteByComboId(combo.getId());

        // Save new combo items
        List<Combos> combos = comboDTO.getCombos();
        if (combos != null && !combos.isEmpty()) {
            combos.forEach(item -> {
                item.setComboId(combo.getId());
                combosRepository.save(item);
            });
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
                combos
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