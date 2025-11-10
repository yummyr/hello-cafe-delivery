package com.yuan.vo;

import com.yuan.entity.ComboItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComboVO {
    private Long id;                    // 套餐id
    private String name;                // 套餐名称
    private Long categoryId;            // 分类id
    private String categoryName;        // 分类名称
    private Double price;               // 套餐价格
    private String image;               // 套餐图片
    private String description;         // 套餐描述
    private Integer status;             // 套餐状态
    private LocalDateTime updateTime;   // 更新时间
    private List<ComboItem> comboItems; // 套餐包含的菜品
}