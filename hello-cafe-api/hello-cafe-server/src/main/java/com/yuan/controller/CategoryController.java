package com.yuan.controller;

import com.yuan.dto.MenuItemDTO;
import com.yuan.entity.Category;
import com.yuan.entity.MenuItem;
import com.yuan.repository.CategoryRepository;
import com.yuan.result.Result;
import com.yuan.service.CategoryService;
import com.yuan.service.MenuItemService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/admin/categories")
public class CategoryController {
    private final CategoryRepository categoryRepository;
    private final MenuItemService menuItemService;
    private final CategoryService categoryService;


    @GetMapping
    public Result getAllCategories() {
        try {
            List<Category> categoryList = categoryRepository.findAll();
            return Result.success(categoryList);
        } catch (Exception e) {

            return Result.error(e.getMessage());
        }
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
