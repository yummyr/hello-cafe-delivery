package com.yuan.service;

import com.yuan.dto.MenuItemDTO;
import com.yuan.entity.Category;
import com.yuan.entity.ComboItem;
import com.yuan.entity.MenuItem;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface CategoryService {
    List<Category> getAllCategory();
    Optional<Category> getCategoryById(Long id);

    Category addMenuItemToCate(MenuItemDTO menuItem);

    ComboItem addComboItemToCate(ComboItem comboItem);


}
