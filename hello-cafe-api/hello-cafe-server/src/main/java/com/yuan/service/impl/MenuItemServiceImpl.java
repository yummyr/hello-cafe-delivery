package com.yuan.service.impl;

import com.yuan.constant.StatusConstant;
import com.yuan.context.UserContext;
import com.yuan.dto.MenuItemDTO;
import com.yuan.entity.MenuItem;
import com.yuan.repository.MenuItemRepository;
import com.yuan.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class MenuItemServiceImpl implements MenuItemService {
    private final MenuItemRepository menuItemRepository;

    @Override
    public MenuItem addMenuItem(MenuItemDTO dto,Long categoryId) {
        Optional<MenuItem> existing = menuItemRepository.findByName(dto.getName());
        if (existing.isPresent()){
            throw new IllegalArgumentException("Menu item exists, try to add another one!");
        }
        Long empId = UserContext.getCurrentUserId();
        MenuItem item = new MenuItem(null, dto.getName(), categoryId, dto.getPrice(),dto.getImage(),
                dto.getDescription(), StatusConstant.ENABLE,LocalDateTime.now(),LocalDateTime.now(),empId,empId);
        menuItemRepository.save(item);
        return item;
    }
}
