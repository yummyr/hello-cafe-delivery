package com.yuan.service.impl;

import com.yuan.constant.MessageConstant;
import com.yuan.constant.StatusConstant;
import com.yuan.dto.CategoryDTO;
import com.yuan.dto.CategoryPageQueryDTO;
import com.yuan.entity.Category;
import com.yuan.exception.DeletionNotAllowedException;
import com.yuan.repository.CategoryRepository;
import com.yuan.repository.ComboRepository;
import com.yuan.repository.MenuItemRepository;
import com.yuan.result.PageResult;
import com.yuan.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final ComboRepository comboRepository;

    @Override
    public PageResult page(CategoryPageQueryDTO dto) {
        if (dto == null) {
            dto = new CategoryPageQueryDTO();
        }

        Pageable pageable = PageRequest.of(dto.getPage() - 1, dto.getPageSize(),
                Sort.by(Sort.Direction.DESC, "updateTime"));

        Page<Category> page = categoryRepository.search(
                (dto.getName() == null || dto.getName().trim().isEmpty()) ? null : dto.getName(),
                dto.getType(),
                pageable
        );

        return new PageResult(page.getTotalElements(), page.getContent());
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException(MessageConstant.ACCOUNT_NOT_FOUND);
        }
        boolean menuExists = menuItemRepository.existsByCategoryId(id);
        boolean comboExists = comboRepository.existsByCategoryId(id);

        if (menuExists) {
            throw new DeletionNotAllowedException(MessageConstant.CATEGORY_BE_RELATED_BY_MENU_ITEM);
        }

        if (comboExists) {
            throw new DeletionNotAllowedException(MessageConstant.CATEGORY_BE_RELATED_BY_COMBO);
        }

        categoryRepository.deleteById(id);
    }

    @Override
    public void updateCategoryStatus(Long id) {
        Category existingCate = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(MessageConstant.ACCOUNT_NOT_FOUND));

        Integer newStatus = existingCate.getStatus() == 1 ? 0 : 1;
        existingCate.setStatus(newStatus);

        categoryRepository.save(existingCate);
        // log.info("Updated category status successfully: {}", existingCate);
    }

    @Override
    public Category addCategory(CategoryDTO dto) {
        Optional<Category> existing = categoryRepository.findByName(dto.getName());
        if (existing.isPresent()) {
            throw new IllegalArgumentException(MessageConstant.ALREADY_EXISTS);
        }

        Integer maxSort = categoryRepository.findMaxSort();
        int newSort = (maxSort == null ? 1 : maxSort + 1);

        Category category = new Category();
        category.setName(dto.getName());
        category.setType(dto.getType());
        category.setSort(newSort);
        category.setStatus(StatusConstant.DISABLE);

        categoryRepository.save(category);
        return category;
    }

    @Override
    public Category updateCategory(CategoryDTO dto) {
        Category existingCate = categoryRepository.findById(dto.getId())
                .orElseThrow(() -> new IllegalArgumentException(MessageConstant.ACCOUNT_NOT_FOUND));

        existingCate.setName(dto.getName());
        existingCate.setType(dto.getType());

        return categoryRepository.save(existingCate);
    }

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }


}
