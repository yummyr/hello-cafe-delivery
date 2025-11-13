package com.yuan.controller.user;

import com.yuan.entity.Category;
import com.yuan.entity.MenuItem;
import com.yuan.entity.MenuItemFlavor;
import com.yuan.repository.CategoryRepository;
import com.yuan.repository.MenuItemFlavorRepository;
import com.yuan.repository.MenuItemRepository;
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
@RequestMapping("/api/user/menu_item")
public class UserMenuItemController {

    private final MenuItemRepository menuItemRepository;
    private final MenuItemFlavorRepository menuItemFlavorRepository;
    private final MenuItemService menuItemService;
    private final CategoryRepository categoryRepository;

    /**
     * query menu items by category
     */
    @GetMapping("/list")
    public Result<List<DishVO>> list(@RequestParam Long categoryId) {
        try {
            log.info("Querying menu items by category id: {}", categoryId);

            // only query active menu items
            List<MenuItem> menuItems = menuItemRepository.findByCategoryIdAndStatus(categoryId, 1);

            List<DishVO> dishVOList = menuItems.stream()
                    .map(this::convertToDishVO)
                    .collect(Collectors.toList());

            return Result.success(dishVOList);
        } catch (Exception e) {
            log.error("Failed to query menu items", e);
            return Result.error("Failed to query menu items: " + e.getMessage());
        }
    }

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
     * get all active menu items list
     */
    @GetMapping("/all")
    public Result<List<MenuItemVO>> getAllActiveMenuItems() {
        try {
            log.info("Fetching all active menu items");
            List<MenuItemVO> menuItems = menuItemService.findAllActive();
            return Result.success(menuItems);
        } catch (Exception e) {
            log.error("Failed to fetch all active menu items", e);
            return Result.error("Failed to fetch menu items: " + e.getMessage());
        }
    }
}