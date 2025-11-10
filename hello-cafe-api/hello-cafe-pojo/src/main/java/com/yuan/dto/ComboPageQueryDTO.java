package com.yuan.dto;

import lombok.Data;

@Data
public class ComboPageQueryDTO {
    private Integer page = 1;        // 页码
    private Integer pageSize = 10;   // 每页记录数
    private String name;             // 套餐名称
    private Integer categoryId;      // 分类id
    private Integer status;          // 套餐起售状态
}