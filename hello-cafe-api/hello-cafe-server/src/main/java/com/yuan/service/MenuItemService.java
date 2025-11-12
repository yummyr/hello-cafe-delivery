package com.yuan.service;

import com.yuan.dto.MenuItemDTO;
import com.yuan.dto.MenuItemPageQueryDTO;
import com.yuan.entity.MenuItem;
import com.yuan.result.PageResult;
import com.yuan.vo.MenuItemVO;
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

    void updateWithFlavor(MenuItemDTO menuItemDTO);

    List<MenuItem> findAll();

    MenuItem getMenuItemById(Long id);

    // User-facing methods
    List<MenuItemVO> findByStatus(Integer status);

    List<MenuItemVO> findByCategoryIdAndStatus(Long categoryId, Integer status);

    List<MenuItemVO> findAllActive();

    MenuItemVO getMenuItemVOById(Long id);
}
