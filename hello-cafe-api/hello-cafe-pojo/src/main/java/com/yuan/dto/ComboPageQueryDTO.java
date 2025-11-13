package com.yuan.dto;

import lombok.Data;

@Data
public class ComboPageQueryDTO {
    private Integer page = 1;        // Page number
    private Integer pageSize = 10;   // Records per page
    private String name;             // Combo name
    private Integer categoryId;      // Category id
    private Integer status;          // Combo sales status
}