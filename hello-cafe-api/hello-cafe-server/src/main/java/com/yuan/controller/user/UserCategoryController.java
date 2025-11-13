package com.yuan.controller.user;

import com.yuan.constant.StatusConstant;
import com.yuan.entity.Category;
import com.yuan.result.Result;
import com.yuan.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/user/categories")
public class UserCategoryController {

    private final CategoryRepository categoryRepository;

    /**
     * Conditional query
     */
    @GetMapping("/list")
    public Result<List<Category>> list(@RequestParam(required = false) Integer type) {
        try {
            log.info("Querying categories with type: {}", type);

            List<Category> categories;
            if (type != null) {
                categories = categoryRepository.findByTypeAndStatusOrderBySortAsc(type, StatusConstant.ENABLE);
            } else {
                categories = categoryRepository.findByStatusOrderBySortAsc(1);
            }

            return Result.success(categories);
        } catch (Exception e) {
            log.error("Failed to query categories", e);
            return Result.error("Failed to query categories: " + e.getMessage());
        }
    }
}