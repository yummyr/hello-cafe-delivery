package com.yuan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComboItemDTO {
    private Long id;
    private String name;
    private Long categoryId;
    private Double price;
    private String image;
    private String description;
    private Integer status;
    private Integer quantity = 1; // Default to 1
}