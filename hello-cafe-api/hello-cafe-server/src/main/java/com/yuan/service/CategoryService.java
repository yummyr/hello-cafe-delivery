package com.yuan.service;

import com.yuan.entity.Category;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface CategoryService {
    List<Category> getAllCategory();
    Optional<Category> getCategoryById(Long id);

}
