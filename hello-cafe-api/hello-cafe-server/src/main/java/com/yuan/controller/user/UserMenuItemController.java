package com.yuan.controller.user;

import com.yuan.entity.MenuItem;
import com.yuan.entity.MenuItemFlavor;
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

    /**
     * 根据分类id查询菜品
     */
    @GetMapping("/list")
    public Result<List<DishVO>> list(@RequestParam Long categoryId) {
        try {
            log.info("Querying menu items by category id: {}", categoryId);

            // 只查询起售状态的菜品
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

        // 查询分类名称
        // TODO: 查询分类名称，这里先设置为默认值
        dishVO.setCategoryName("默认分类");

        // 查询口味信息
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
        flavorVO.setValue(flavor.getValue().toString()); // 将List转换为字符串
        return flavorVO;
    }

    /**
     * 获取所有活跃的菜单项
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