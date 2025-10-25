package com.yuan.service;

import com.yuan.dto.MenuItemDTO;
import com.yuan.entity.MenuItem;
import org.springframework.stereotype.Service;

@Service
public interface MenuItemService {
    MenuItem addMenuItem(MenuItemDTO dto, Long categoryId);
}
