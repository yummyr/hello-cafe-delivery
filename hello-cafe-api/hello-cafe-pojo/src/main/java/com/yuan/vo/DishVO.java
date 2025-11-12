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
    private Long id;                    // 菜品id
    private String name;                // 菜品名称
    private String categoryName;        // 分类名称
    private String description;         // 菜品描述
    private String image;               // 菜品图片路径
    private Double price;               // 价格
    private Integer status;             // 状态
    private LocalDateTime updateTime;   // 更新时间
    private List<MenuItemFlavorVO> flavors; // 菜品口味
}