package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DishOverViewVO {
    private Integer sold;          // 已启售菜品数量
    private Integer discontinued;  // 已停售菜品数量
}