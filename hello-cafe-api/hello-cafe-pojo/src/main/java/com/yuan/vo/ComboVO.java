package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComboVO {
    private Long id;                    // Combo id
    private String name;                // Combo name
    private Long categoryId;            // Category id
    private String categoryName;        // Category name
    private Double price;               // Combo price
    private String image;               // Combo image
    private String description;         // Combo description
    private Integer status;             // Combo status
    private LocalDateTime updateTime;   // Update time
    private List<ComboItemVO> items; // Menu items included in combo with details
}