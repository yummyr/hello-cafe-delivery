package com.yuan.service.impl;

import com.yuan.constant.CategoryTypeConstant;
import com.yuan.constant.StatusConstant;
import com.yuan.context.UserContext;
import com.yuan.dto.MenuItemDTO;
import com.yuan.entity.Category;
import com.yuan.entity.ComboItem;
import com.yuan.entity.MenuItem;
import com.yuan.repository.CategoryRepository;
import com.yuan.repository.ComboItemRepository;
import com.yuan.repository.MenuItemRepository;
import com.yuan.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    private final ComboItemRepository comboItemRepository;


    @Override
    public List<Category> getAllCategory() {
        return categoryRepository.findAll();
    }

    @Override
    public Optional<Category> getCategoryById(Long id) {
        return Optional.ofNullable(categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Can not find category with id: " + id)));
    }

    @Override
    public Category addMenuItemToCate(MenuItemDTO dto) {
        Optional<Category> existing = categoryRepository.findByName(dto.getName());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Menu item exists, add another one");
        }
        Long empId = UserContext.getCurrentUserId();
        Category category = new Category(null, dto.getName(), CategoryTypeConstant.MENU, dto.getType(), StatusConstant.ENABLE, LocalDateTime.now(), LocalDateTime.now(), empId, empId);
        return categoryRepository.save(category);
    }

    @Override
    public ComboItem addComboItemToCate(ComboItem comboItem) {
        return null;
    }
}
