package com.yuan.controller.user;

import com.yuan.constant.StatusConstant;
import com.yuan.result.Result;
import com.yuan.service.MenuItemService;
import com.yuan.vo.MenuItemVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("userMenuController")
@RequestMapping("/api/user/menu")
@Slf4j
@RequiredArgsConstructor
public class MenuItemController {

    private final MenuItemService menuItemService;

    @GetMapping("/featured")
    public Result getFeaturedItems() {
        try {
            log.info("Fetching featured menu items");
            // Get active menu items and limit to 6 items for featured section
            List<MenuItemVO> featuredItems = menuItemService.findByStatus(StatusConstant.ENABLE);

            // If we have more than 6 items, return only the first 6
            if (featuredItems.size() > 6) {
                featuredItems = featuredItems.subList(0, 6);
            }

            return Result.success(featuredItems);
        } catch (Exception e) {
            log.error("Failed to fetch featured menu items", e);
            return Result.error("Failed to fetch featured menu items: " + e.getMessage());
        }
    }

    @GetMapping("/category/{categoryId}")
    public Result getMenuItemsByCategory(@PathVariable Long categoryId) {
        try {
            log.info("Fetching menu items for category: {}", categoryId);
            List<MenuItemVO> menuItems = menuItemService.findByCategoryIdAndStatus(categoryId, StatusConstant.ENABLE);
            return Result.success(menuItems);
        } catch (Exception e) {
            log.error("Failed to fetch menu items for category: {}", categoryId, e);
            return Result.error("Failed to fetch menu items: " + e.getMessage());
        }
    }

    @GetMapping("/item/{id}")
    public Result getMenuItemById(@PathVariable Long id) {
        try {
            log.info("Fetching menu item details for id: {}", id);
            MenuItemVO menuItem = menuItemService.getMenuItemVOById(id);
            return Result.success(menuItem);
        } catch (Exception e) {
            log.error("Failed to fetch menu item details for id: {}", id, e);
            return Result.error("Failed to fetch menu item details: " + e.getMessage());
        }
    }
}