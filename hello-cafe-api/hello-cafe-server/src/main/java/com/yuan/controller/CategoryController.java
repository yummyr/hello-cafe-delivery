package com.yuan.controller;

import com.yuan.entity.Category;
import com.yuan.entity.Employee;
import com.yuan.repository.CategoryRepository;
import com.yuan.result.Result;
import com.yuan.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/admin/categories")
public class CategoryController {
    private final CategoryRepository categoryRepository;

    @GetMapping
    public Result getAllCategories() {
        try {
            List<Category> categoryList = categoryRepository.findAll();
            return Result.success(categoryList);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

}
