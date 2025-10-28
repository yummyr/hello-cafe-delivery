package com.yuan.service.impl;

import com.yuan.constant.CategoryTypeConstant;
import com.yuan.constant.MessageConstant;
import com.yuan.constant.StatusConstant;
import com.yuan.context.UserContext;
import com.yuan.dto.CategoryDTO;
import com.yuan.dto.CategoryPageQueryDTO;
import com.yuan.dto.MenuItemDTO;
import com.yuan.entity.Category;
import com.yuan.entity.ComboItem;
import com.yuan.entity.MenuItem;
import com.yuan.exception.DeletionNotAllowedException;
import com.yuan.repository.CategoryRepository;
import com.yuan.repository.ComboItemRepository;
import com.yuan.repository.ComboRepository;
import com.yuan.repository.MenuItemRepository;
import com.yuan.result.PageResult;
import com.yuan.service.CategoryService;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
    public Category addMenuItemToCate(MenuItemDTO dto) {
        Optional<Category> existing = categoryRepository.findByName(dto.getName());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Menu item exists, add another one");
        }
        Long empId = UserContext.getCurrentUserId();
        Category category = new Category(null, dto.getName(), CategoryTypeConstant.MENU, dto.getSort(),
                StatusConstant.DISABLE, LocalDateTime.now(), LocalDateTime.now(), empId, empId);
        log.info("添加menu item在category里面，数据:{}", category.toString());
        return categoryRepository.save(category);
    }

    @Override
    public PageResult page(CategoryPageQueryDTO dto) {
        if (dto == null) {
            dto = new CategoryPageQueryDTO();
        }

        // log.info("分类分页查询dto：{}",dto.toString());
        Pageable pageable = PageRequest.of(dto.getPage() - 1, dto.getPageSize(),
                Sort.by(Sort.Direction.DESC, "updateTime"));

        Page<Category> page = categoryRepository.search(
                (dto.getName() == null || dto.getName().trim().isEmpty()) ? null : dto.getName(),
                dto.getType(),
                pageable
        );

        // log.info("分类分页查询结果：total={}, records={}", page.getTotalElements(), page.getContent().size());
        return new PageResult(page.getTotalElements(), page.getContent());
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Category not found: " + id);
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
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        Long empId = UserContext.getCurrentUserId();
        Integer newStatus = existingCate.getStatus() == 1 ? 0 : 1;
        existingCate.setStatus(newStatus);
        existingCate.setUpdateTime(LocalDateTime.now());
        existingCate.setUpdateEmployee(empId);

        categoryRepository.save(existingCate); // Update the existing record
        log.info("Updated category status successfully: {}", existingCate);

    }

    @Override
    public Category addCategory(CategoryDTO dto) {

        Optional<Category> existing = categoryRepository.findByName(dto.getName());
        if (existing.isPresent()){
            throw new IllegalArgumentException("Category already exists!");
        }
        Integer maxSort = categoryRepository.findMaxSort();
        int newSort = (maxSort == null ? 1 : maxSort + 1);
        long empId = UserContext.getCurrentUserId();
        Category category = new Category(null, dto.getName(), dto.getType(), newSort, StatusConstant.DISABLE,
                LocalDateTime.now(),LocalDateTime.now(),empId,empId);
        categoryRepository.save(category);
        return category;
    }
}
