package com.yuan.service;

import com.yuan.dto.MenuItemDTO;
import com.yuan.dto.MenuItemPageQueryDTO;
import com.yuan.entity.MenuItem;
import com.yuan.result.PageResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MenuItemService {
    MenuItem addMenuItem(MenuItemDTO dto);

    PageResult findAllWithCategory(MenuItemPageQueryDTO dto);

    void deleteIds(List<Long> idList);

    void changeItemStatus(Long id);

    List<MenuItem> findByIds(List<Long> idList);

    MenuItem updateMenuItem(MenuItemDTO dto);

    List<MenuItem> findAll();

    MenuItem getMenuItemById(Long id);
}
