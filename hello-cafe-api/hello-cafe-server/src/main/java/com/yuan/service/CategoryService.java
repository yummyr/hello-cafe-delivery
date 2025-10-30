package com.yuan.service;

import com.yuan.dto.CategoryDTO;
import com.yuan.dto.CategoryPageQueryDTO;
import com.yuan.dto.MenuItemDTO;
import com.yuan.entity.Category;
import com.yuan.entity.ComboItem;
import com.yuan.result.PageResult;
import org.springframework.stereotype.Service;

@Service
public interface CategoryService {

    PageResult page(CategoryPageQueryDTO dto);

    void deleteCategory(Long id);

    void updateCategoryStatus(Long id);

    Category addCategory(CategoryDTO dto);

    Category updateCategory(CategoryDTO dto);

}
