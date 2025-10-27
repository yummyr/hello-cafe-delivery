package com.yuan.service;

import com.yuan.dto.CategoryPageQueryDTO;
import com.yuan.dto.MenuItemDTO;
import com.yuan.entity.Category;
import com.yuan.entity.ComboItem;
import com.yuan.entity.MenuItem;
import com.yuan.result.PageResult;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface CategoryService {


    Category addMenuItemToCate(MenuItemDTO menuItem);

    ComboItem addComboItemToCate(ComboItem comboItem);

    PageResult page(CategoryPageQueryDTO dto);

    void deleteEmployee(Long id);
}
