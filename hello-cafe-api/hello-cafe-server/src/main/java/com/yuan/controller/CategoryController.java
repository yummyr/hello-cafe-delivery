package com.yuan.controller;

import com.yuan.dto.CategoryPageQueryDTO;
import com.yuan.dto.MenuItemDTO;
import com.yuan.entity.Category;
import com.yuan.entity.MenuItem;
import com.yuan.result.PageResult;
import com.yuan.result.Result;
import com.yuan.service.CategoryService;
import com.yuan.service.MenuItemService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/admin/categories")
public class CategoryController {
    private final MenuItemService menuItemService;
    private final CategoryService categoryService;

    @GetMapping("/page")
    public Result getCategories(CategoryPageQueryDTO dto) {
        try {
            PageResult pageResult = categoryService.page(dto);
            return Result.success(pageResult);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    public Result<Long> deleteEmployee(@PathVariable Long id) {
        categoryService.deleteEmployee(id);
        return Result.success(id);
    }

    @PutMapping("/menu_item")
    @Transactional
    public Result addMenuItemCategory(@RequestBody MenuItemDTO dto) {
        // log.info("MenuItemDTO dto in addMenuItemCategory is:{} ", dto);
        try {
            Category item = categoryService.addMenuItemToCate(dto);
            // log.info(" Category item  in  addMenuItemCategory :{}", item);
            Long categoryId = item.getId();

            MenuItem menuItem = menuItemService.addMenuItem(dto, categoryId);
            // log.info(" MenuItem item  in  addMenuItemCategory :{}", menuItem);
            return Result.success(menuItem);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }

    }

    @PutMapping("/combo_item")
    public Result addComboItemCategory() {
        return Result.success();
    }

}
