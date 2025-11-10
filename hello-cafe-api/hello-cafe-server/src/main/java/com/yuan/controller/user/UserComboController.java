package com.yuan.controller.user;

import com.yuan.entity.Combo;
import com.yuan.entity.ComboItem;
import com.yuan.entity.MenuItem;
import com.yuan.repository.ComboItemRepository;
import com.yuan.repository.ComboRepository;
import com.yuan.repository.MenuItemRepository;
import com.yuan.result.Result;
import com.yuan.vo.DishItemVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/user/combo")
public class UserComboController {

    private final ComboRepository comboRepository;
    private final ComboItemRepository comboItemRepository;
    private final MenuItemRepository menuItemRepository;

    /**
     * 根据分类id查询套餐
     */
    @GetMapping("/list")
    public Result<List<Combo>> list(@RequestParam Long categoryId) {
        try {
            log.info("Querying combos by category id: {}", categoryId);

            // 只查询起售状态的套餐
            List<Combo> combos = comboRepository.findByCategoryIdAndStatus(categoryId, 1);

            return Result.success(combos);
        } catch (Exception e) {
            log.error("Failed to query combos", e);
            return Result.error("Failed to query combos: " + e.getMessage());
        }
    }

    /**
     * 根据套餐id查询包含的菜品
     */
    @GetMapping("/menu_item/{id}")
    public Result<List<DishItemVO>> getComboMenuItems(@PathVariable Long id) {
        try {
            log.info("Querying menu items for combo id: {}", id);

            // 查询套餐包含的菜品
            List<ComboItem> comboItems = comboItemRepository.findByComboId(id);

            List<DishItemVO> dishItems = comboItems.stream()
                    .map(comboItem -> {
                        DishItemVO dishItem = new DishItemVO();

                        // 获取菜品信息
                        MenuItem menuItem = menuItemRepository.findById(comboItem.getMenuItemId())
                                .orElse(null);

                        if (menuItem != null) {
                            dishItem.setName(menuItem.getName());
                            dishItem.setDescription(menuItem.getDescription());
                            dishItem.setImage(menuItem.getImage());
                        } else {
                            dishItem.setName(comboItem.getName());
                            dishItem.setDescription("");
                            dishItem.setImage("");
                        }

                        dishItem.setCopies(comboItem.getQuantity());

                        return dishItem;
                    })
                    .collect(Collectors.toList());

            return Result.success(dishItems);
        } catch (Exception e) {
            log.error("Failed to query combo menu items", e);
            return Result.error("Failed to query combo menu items: " + e.getMessage());
        }
    }
}