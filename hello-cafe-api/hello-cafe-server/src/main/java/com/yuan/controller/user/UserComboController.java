package com.yuan.controller.user;

import com.yuan.entity.Combo;
import com.yuan.entity.Combos;
import com.yuan.entity.MenuItem;
import com.yuan.repository.CombosRepository;
import com.yuan.repository.ComboRepository;
import com.yuan.repository.MenuItemRepository;
import com.yuan.result.Result;
import com.yuan.vo.MenuItemVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/user/combo")
public class UserComboController {

    private final ComboRepository comboRepository;
    private final CombosRepository combosRepository;
    private final MenuItemRepository menuItemRepository;

    /**
     * query combos by category
     */
    @GetMapping("/list")
    public Result<List<Combo>> list(@RequestParam Long categoryId) {
        try {
            log.info("Querying combos by category id: {}", categoryId);

            // only query active combos
            List<Combo> combos = comboRepository.findByCategoryIdAndStatus(categoryId, 1);

            return Result.success(combos);
        } catch (Exception e) {
            log.error("Failed to query combos", e);
            return Result.error("Failed to query combos: " + e.getMessage());
        }
    }

    /**
     * Get menu items included in combo by combo id
     */
    @GetMapping("/menu_item/{id}")
    public Result<List<MenuItemVO>> getComboMenuItems(@PathVariable Long id) {
        try {
            log.info("Querying menu items for combo id: {}", id);

            // Query menu items included in combo
            List<Combos> combos = combosRepository.findByComboId(id);

            List<MenuItemVO> menuItems = combos.stream()
                    .map(comboItem -> {
                        MenuItemVO menuItemVO = new MenuItemVO();

                        // get menu item info
                        MenuItem menuItem = menuItemRepository.findById(comboItem.getMenuItemId())
                                .orElse(null);

                        if (menuItem != null) {
                            menuItemVO.setId(menuItem.getId());
                            menuItemVO.setName(menuItem.getName());
                            menuItemVO.setDescription(menuItem.getDescription());
                            menuItemVO.setImage(menuItem.getImage());
                            menuItemVO.setPrice(menuItem.getPrice());
                            menuItemVO.setStatus(menuItem.getStatus());
                            menuItemVO.setUpdateTime(menuItem.getUpdateTime());
                        }

                        return menuItemVO;
                    })
                    .collect(Collectors.toList());

            return Result.success(menuItems);
        } catch (Exception e) {
            log.error("Failed to query combo menu items", e);
            return Result.error("Failed to query combo menu items: " + e.getMessage());
        }
    }

    /**
     * query all active combos
     */
    @GetMapping("/all")
    public Result<List<Combo>> getAllActiveCombos() {
        try {
            log.info("Fetching all active combos");
            List<Combo> combos = comboRepository.findByStatus(1);
            return Result.success(combos);
        } catch (Exception e) {
            log.error("Failed to fetch all active combos", e);
            return Result.error("Failed to fetch combos: " + e.getMessage());
        }
    }
}