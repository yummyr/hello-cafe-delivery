package com.yuan.service.impl;

import com.yuan.constant.CategoryTypeConstant;
import com.yuan.constant.StatusConstant;
import com.yuan.context.UserContext;
import com.yuan.dto.CategoryPageQueryDTO;
import com.yuan.dto.MenuItemDTO;
import com.yuan.entity.Category;
import com.yuan.entity.ComboItem;
import com.yuan.entity.MenuItem;
import com.yuan.repository.CategoryRepository;
import com.yuan.repository.ComboItemRepository;
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
    public Category addMenuItemToCate(MenuItemDTO dto) {
        Optional<Category> existing = categoryRepository.findByName(dto.getName());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Menu item exists, add another one");
        }
        Long empId = UserContext.getCurrentUserId();
        Category category = new Category(null, dto.getName(), CategoryTypeConstant.MENU, dto.getType(),
                StatusConstant.ENABLE, LocalDateTime.now(), LocalDateTime.now(), empId, empId);
        return categoryRepository.save(category);
    }

    @Override
    public ComboItem addComboItemToCate(ComboItem comboItem) {
        return null;
    }

    @Override
    public PageResult page(CategoryPageQueryDTO dto) {
        if (dto == null){
            dto = new CategoryPageQueryDTO();
        }
        Pageable pageable = PageRequest.of(dto.getPage()-1,dto.getPageSize(),
                Sort.by(Sort.Direction.DESC, "updateTime") );
        Page<Category> page ;
        if (dto.getName() == null){
            page = categoryRepository.findAll(pageable);
        }else {
            page = categoryRepository.findByNameContaining(dto.getName(),pageable);
        }

        return new PageResult(page.getTotalElements(), page.getContent());
    }

    @Override
    public void deleteEmployee(Long id) {
        categoryRepository.deleteById(id);
    }
}
