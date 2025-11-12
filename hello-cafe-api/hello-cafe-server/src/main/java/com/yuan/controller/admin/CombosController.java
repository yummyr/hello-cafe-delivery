package com.yuan.controller.admin;

import com.yuan.entity.Combos;
import com.yuan.result.Result;
import com.yuan.service.CombosService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/admin/combos")
public class CombosController {

    private final CombosService combosService;

    @PostMapping
    public Result addCombos(@RequestBody List<Combos> combos) {
        try {
            log.info("Adding {} combo items", combos.size());

            List<Combos> savedItems = combosService.addComboItems(combos);
            return Result.success(savedItems);
        } catch (Exception e) {
            log.error("Failed to add combo items", e);
            return Result.error("Failed to add combo items: " + e.getMessage());
        }
    }

    @DeleteMapping
    public Result deleteCombos(@RequestBody List<Long> idList) {
        try {
            log.info("Deleting {} combo items", idList.size());
            combosService.deleteComboItems(idList);
            return Result.success();
        } catch (Exception e) {
            log.error("Failed to delete combo items", e);
            return Result.error("Failed to delete combo items: " + e.getMessage());
        }
    }

    @DeleteMapping("/menu-item/{menuItemId}")
    public Result deleteComboItemsByMenuItemId(@PathVariable Long menuItemId) {
        try {
            log.info("Deleting combo items for menu item: {}", menuItemId);
            combosService.deleteComboItemsByMenuItemId(menuItemId);
            return Result.success();
        } catch (Exception e) {
            log.error("Failed to delete combo items for menu item: {}", menuItemId, e);
            return Result.error("Failed to delete combo items: " + e.getMessage());
        }
    }

    @GetMapping("/combo/{comboId}")
    public Result getComboItemsByComboId(@PathVariable Long comboId) {
        try {
            List<Combos> items = combosService.getComboItemsByComboId(comboId);
            return Result.success(items);
        } catch (Exception e) {
            log.error("Failed to get combo items for combo: {}", comboId, e);
            return Result.error("Failed to get combo items: " + e.getMessage());
        }
    }

    @GetMapping("/menu-item/{menuItemId}")
    public Result getCombosByMenuItemId(@PathVariable Long menuItemId) {
        try {
            List<Combos> items = combosService.getComboItemsByMenuItemId(menuItemId);
            return Result.success(items);
        } catch (Exception e) {
            log.error("Failed to get combo items for menu item: {}", menuItemId, e);
            return Result.error("Failed to get combo items: " + e.getMessage());
        }
    }

    @PutMapping
    public Result updateCombos(@RequestBody Combos combos) {
        try {
            log.info("Updating combo item: {}", combos.getId());
            Combos updatedItem = combosService.updateComboItem(combos);
            return Result.success(updatedItem);
        } catch (Exception e) {
            log.error("Failed to update combo item", e);
            return Result.error("Failed to update combo item: " + e.getMessage());
        }
    }

    @GetMapping
    public Result getAllCombos() {
        try {
            List<Combos> combos = combosService.getAllCombos();
            return Result.success(combos);
        } catch (Exception e) {
            log.error("Failed to get all combo items", e);
            return Result.error("Failed to get combo items: " + e.getMessage());
        }
    }

    /**
     *
     */
}