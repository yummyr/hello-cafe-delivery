package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DishFlavorVO {
    private Long id;          // 口味id
    private Long dishId;       // 菜品id
    private String name;       // 口味名称
    private String value;      // 口味值（JSON字符串）
}