package com.yuan.service.impl;

import com.yuan.constant.MessageConstant;
import com.yuan.constant.StatusConstant;
import com.yuan.dto.ComboDTO;
import com.yuan.dto.ComboPageQueryDTO;
import com.yuan.entity.Category;
import com.yuan.entity.Combo;
import com.yuan.entity.ComboItem;
import com.yuan.repository.CategoryRepository;
import com.yuan.repository.ComboItemRepository;
import com.yuan.repository.ComboRepository;
import com.yuan.result.PageResult;
import com.yuan.service.ComboService;
import com.yuan.service.impl.S3Service;
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
    private final ComboItemRepository comboItemRepository;
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

        // Save combo items
        List<ComboItem> comboItems = comboDTO.getComboItems();
        if (comboItems != null && !comboItems.isEmpty()) {
            comboItems.forEach(item -> {
                item.setComboId(savedCombo.getId());
                comboItemRepository.save(item);
            });
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
                    List<ComboItem> comboItems = comboItemRepository.findByComboId(combo.getId());
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
                            comboItems
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
            List<ComboItem> comboItems = comboItemRepository.findByComboId(comboId);
            for (ComboItem item : comboItems) {
                // If menu items have images, delete them from S3
                // Note: This assumes ComboItem might have an image field
                // You may need to adjust based on your actual data model
            }
            comboItemRepository.deleteByComboId(comboId);
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
        comboItemRepository.deleteByComboId(combo.getId());

        // Save new combo items
        List<ComboItem> comboItems = comboDTO.getComboItems();
        if (comboItems != null && !comboItems.isEmpty()) {
            comboItems.forEach(item -> {
                item.setComboId(combo.getId());
                comboItemRepository.save(item);
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

        List<ComboItem> comboItems = comboItemRepository.findByComboId(id);

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
                comboItems
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
}