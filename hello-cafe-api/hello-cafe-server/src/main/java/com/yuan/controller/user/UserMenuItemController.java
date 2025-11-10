package com.yuan.controller.user;

import com.yuan.entity.MenuItem;
import com.yuan.entity.MenuItemFlavor;
import com.yuan.repository.MenuItemFlavorRepository;
import com.yuan.repository.MenuItemRepository;
import com.yuan.result.Result;
import com.yuan.vo.DishFlavorVO;
import com.yuan.vo.DishVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/user/menu_item")
public class UserMenuItemController {

    private final MenuItemRepository menuItemRepository;
    private final MenuItemFlavorRepository menuItemFlavorRepository;

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
        List<DishFlavorVO> flavorVOs = flavors.stream()
                .map(this::convertToDishFlavorVO)
                .collect(Collectors.toList());
        dishVO.setFlavors(flavorVOs);

        return dishVO;
    }

    private DishFlavorVO convertToDishFlavorVO(MenuItemFlavor flavor) {
        DishFlavorVO flavorVO = new DishFlavorVO();
        flavorVO.setId(flavor.getId());
        flavorVO.setDishId(flavor.getMenuItemId());
        flavorVO.setName(flavor.getName());
        flavorVO.setValue(flavor.getValue().toString()); // 将List转换为字符串
        return flavorVO;
    }
}