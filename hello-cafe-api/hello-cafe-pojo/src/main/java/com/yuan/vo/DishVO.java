package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DishVO {
    private Long id;                    // Dish id
    private String name;                // Dish name
    private String categoryName;        // Category name
    private String description;         // Dish description
    private String image;               // Dish image path
    private Double price;               // Price
    private Integer status;             // Status
    private LocalDateTime updateTime;   // Update time
    private List<MenuItemFlavorVO> flavors; // Dish flavors
}