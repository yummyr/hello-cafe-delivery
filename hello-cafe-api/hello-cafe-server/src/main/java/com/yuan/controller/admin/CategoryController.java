package com.yuan.controller.admin;

import com.yuan.dto.CategoryDTO;
import com.yuan.dto.CategoryPageQueryDTO;
import com.yuan.entity.Category;
import com.yuan.result.PageResult;
import com.yuan.result.Result;
import com.yuan.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/admin/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    public Result addCategory(@RequestBody CategoryDTO dto) {
        Category category = categoryService.addCategory(dto);
        return Result.success(category);
    }

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
    public Result<Long> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return Result.success(id);
    }

    @PutMapping("/status/{id}")
    public Result<Long> changeCategoryStatus(@PathVariable Long id) {

        categoryService.updateCategoryStatus(id);
        return Result.success(id);
    }

    @PutMapping("/{id}")
    public Result updateCategory(@RequestBody CategoryDTO dto){
        categoryService.updateCategory(dto);
        return Result.success();
    }

    @GetMapping
    public Result getCategories() {
        List<Category> categories = categoryService.findAll();
        return Result.success(categories);
    }

}
