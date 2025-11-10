package com.yuan.controller.admin;

import com.yuan.entity.ComboItem;
import com.yuan.result.Result;
import com.yuan.service.ComboItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/admin/combo-items")
public class ComboItemController {

    private final ComboItemService comboItemService;

    @PostMapping
    public Result addComboItems(@RequestBody List<ComboItem> comboItems) {
        try {
            log.info("Adding {} combo items", comboItems.size());

            List<ComboItem> savedItems = comboItemService.addComboItems(comboItems);
            return Result.success(savedItems);
        } catch (Exception e) {
            log.error("Failed to add combo items", e);
            return Result.error("Failed to add combo items: " + e.getMessage());
        }
    }

    @DeleteMapping
    public Result deleteComboItems(@RequestBody List<Long> idList) {
        try {
            log.info("Deleting {} combo items", idList.size());
            comboItemService.deleteComboItems(idList);
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
            comboItemService.deleteComboItemsByMenuItemId(menuItemId);
            return Result.success();
        } catch (Exception e) {
            log.error("Failed to delete combo items for menu item: {}", menuItemId, e);
            return Result.error("Failed to delete combo items: " + e.getMessage());
        }
    }

    @GetMapping("/combo/{comboId}")
    public Result getComboItemsByComboId(@PathVariable Long comboId) {
        try {
            List<ComboItem> items = comboItemService.getComboItemsByComboId(comboId);
            return Result.success(items);
        } catch (Exception e) {
            log.error("Failed to get combo items for combo: {}", comboId, e);
            return Result.error("Failed to get combo items: " + e.getMessage());
        }
    }

    @GetMapping("/menu-item/{menuItemId}")
    public Result getComboItemsByMenuItemId(@PathVariable Long menuItemId) {
        try {
            List<ComboItem> items = comboItemService.getComboItemsByMenuItemId(menuItemId);
            return Result.success(items);
        } catch (Exception e) {
            log.error("Failed to get combo items for menu item: {}", menuItemId, e);
            return Result.error("Failed to get combo items: " + e.getMessage());
        }
    }

    @PutMapping
    public Result updateComboItem(@RequestBody ComboItem comboItem) {
        try {
            log.info("Updating combo item: {}", comboItem.getId());
            ComboItem updatedItem = comboItemService.updateComboItem(comboItem);
            return Result.success(updatedItem);
        } catch (Exception e) {
            log.error("Failed to update combo item", e);
            return Result.error("Failed to update combo item: " + e.getMessage());
        }
    }

    @GetMapping
    public Result getAllComboItems() {
        try {
            List<ComboItem> items = comboItemService.getAllComboItems();
            return Result.success(items);
        } catch (Exception e) {
            log.error("Failed to get all combo items", e);
            return Result.error("Failed to get combo items: " + e.getMessage());
        }
    }

    /**
     *
     */
}