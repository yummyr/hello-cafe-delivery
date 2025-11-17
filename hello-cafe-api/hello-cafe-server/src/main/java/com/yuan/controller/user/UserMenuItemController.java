package com.yuan.controller.user;

import com.yuan.constant.StatusConstant;
import com.yuan.dto.MenuItemPageQueryDTO;
import com.yuan.entity.Category;
import com.yuan.entity.MenuItem;
import com.yuan.entity.MenuItemFlavor;
import com.yuan.repository.CategoryRepository;
import com.yuan.repository.MenuItemFlavorRepository;
import com.yuan.repository.MenuItemRepository;
import com.yuan.result.PageResult;
import com.yuan.result.Result;
import com.yuan.service.MenuItemService;
import com.yuan.vo.MenuItemFlavorVO;
import com.yuan.vo.DishVO;
import com.yuan.vo.MenuItemVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/user/menu")
public class UserMenuItemController {

    private final MenuItemRepository menuItemRepository;
    private final MenuItemFlavorRepository menuItemFlavorRepository;
    private final MenuItemService menuItemService;
    private final CategoryRepository categoryRepository;

    /**
     * query menu items by category
     */
    // @GetMapping("/list")
    // public Result<List<DishVO>> list(@RequestParam Long categoryId) {
    //     try {
    //         log.info("Querying menu items by category id: {}", categoryId);
    //
    //         // only query active menu items
    //         List<MenuItem> menuItems = menuItemRepository.findByCategoryIdAndStatus(categoryId, 1);
    //
    //         List<DishVO> dishVOList = menuItems.stream()
    //                 .map(this::convertToDishVO)
    //                 .collect(Collectors.toList());
    //
    //         return Result.success(dishVOList);
    //     } catch (Exception e) {
    //         log.error("Failed to query menu items", e);
    //         return Result.error("Failed to query menu items: " + e.getMessage());
    //     }
    // }

    private DishVO convertToDishVO(MenuItem menuItem) {
        DishVO dishVO = new DishVO();
        dishVO.setId(menuItem.getId());
        dishVO.setName(menuItem.getName());
        dishVO.setDescription(menuItem.getDescription());
        dishVO.setImage(menuItem.getImage());
        dishVO.setPrice(menuItem.getPrice());
        dishVO.setStatus(menuItem.getStatus());
        dishVO.setUpdateTime(menuItem.getUpdateTime());

        // query category
        if (menuItem.getCategoryId() != null) {
            try {
                Category category = categoryRepository.findById(menuItem.getCategoryId()).orElse(null);
                dishVO.setCategoryName(category != null ? category.getName() : "Unknown");
            } catch (Exception e) {
                log.warn("Failed to fetch category for menu item {}: {}", menuItem.getId(), e.getMessage());
                dishVO.setCategoryName("Unknown");
            }
        } else {
            dishVO.setCategoryName("Uncategorized");
        }

        // query flavors
        List<MenuItemFlavor> flavors = menuItemFlavorRepository.findByMenuItemId(menuItem.getId());
        List<MenuItemFlavorVO> flavorVOs = flavors.stream()
                .map(this::convertToDishFlavorVO)
                .collect(Collectors.toList());
        dishVO.setFlavors(flavorVOs);

        return dishVO;
    }

    private MenuItemFlavorVO convertToDishFlavorVO(MenuItemFlavor flavor) {
        MenuItemFlavorVO flavorVO = new MenuItemFlavorVO();
        flavorVO.setId(flavor.getId());
        flavorVO.setId(flavor.getMenuItemId());
        flavorVO.setName(flavor.getName());
        flavorVO.setValue(flavor.getValue().toString()); // convert to string
        return flavorVO;
    }

    /**
     * get featured items
     */
    @GetMapping("/featured")
    public Result<List<MenuItemVO>> getFeaturedItems() {
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

    // /**
    //  * get menu items by category
    //  */
    // @GetMapping("/category/{categoryId}")
    // public Result<List<MenuItemVO>> getMenuItemsByCategory(@PathVariable Long categoryId) {
    //     try {
    //         log.info("Fetching menu items for category: {}", categoryId);
    //         List<MenuItemVO> menuItems = menuItemService.findByCategoryIdAndStatus(categoryId, StatusConstant.ENABLE);
    //         return Result.success(menuItems);
    //     } catch (Exception e) {
    //         log.error("Failed to fetch menu items for category: {}", categoryId, e);
    //         return Result.error("Failed to fetch menu items: " + e.getMessage());
    //     }
    // }

    /**
     * get menu item by id
     */
    @GetMapping("/item/{id}")
    public Result<MenuItemVO> getMenuItemById(@PathVariable Long id) {
        try {
            log.info("Fetching menu item details for id: {}", id);
            MenuItemVO menuItem = menuItemService.getMenuItemVOById(id);
            return Result.success(menuItem);
        } catch (Exception e) {
            log.error("Failed to fetch menu item details for id: {}", id, e);
            return Result.error("Failed to fetch menu item details: " + e.getMessage());
        }
    }

    /**
     * get all active menu items list
     */
    @GetMapping("/page")
    public Result getAllActiveMenuItems(MenuItemPageQueryDTO dto) {
        try {
            log.info("Fetching all active menu items");
            PageResult result = menuItemService.findAllWithCategory(dto);
            return Result.success(result);
        } catch (Exception e) {
            log.error("Failed to fetch all active menu items", e);
            return Result.error("Failed to fetch menu items: " + e.getMessage());
        }
    }

    /**
     * get newest menu items (latest 3)
     */
    @GetMapping("/newest")
    public Result<List<MenuItemVO>> getNewestMenuItems() {
        try {
            log.info("Fetching newest 3 menu items");
            List<MenuItemVO> newestItems = menuItemService.findNewestItems(3);
            return Result.success(newestItems);
        } catch (Exception e) {
            log.error("Failed to fetch newest menu items", e);
            return Result.error("Failed to fetch newest menu items: " + e.getMessage());
        }
    }
}