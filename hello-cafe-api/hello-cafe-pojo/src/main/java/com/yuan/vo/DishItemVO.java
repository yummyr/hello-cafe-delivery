package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DishItemVO {
    private String name;        // 菜品名称
    private String description; // 菜品描述
    private String image;        // 菜品图片路径
    private Integer copies;      // 份数
}