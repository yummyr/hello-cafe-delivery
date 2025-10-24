package com.yuan.service.impl;

import com.yuan.entity.Category;
import com.yuan.repository.CategoryRepository;
import com.yuan.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategory() {
        return categoryRepository.findAll();
    }

    @Override
    public Optional<Category> getCategoryById(Long id) {
        return Optional.ofNullable(categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Can not find category with id: " + id)));
    }
}
