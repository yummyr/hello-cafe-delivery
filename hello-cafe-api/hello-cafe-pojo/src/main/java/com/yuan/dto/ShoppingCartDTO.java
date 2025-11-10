package com.yuan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingCartDTO {
    private Long dishId;       // 菜品id
    private Long setmealId;    // 套餐id
    private String flavor;  // 口味
}