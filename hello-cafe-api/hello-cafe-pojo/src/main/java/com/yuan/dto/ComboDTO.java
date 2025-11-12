package com.yuan.dto;

import com.yuan.entity.Combos;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
public class ComboDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long id;                    // 套餐id
    private String name;                // 套餐名称
    private Long categoryId;            // 分类id
    private Double price;               // 套餐价格
    private String image;               // 套餐图片
    private String description;         // 套餐描述
    private Integer status;             // 套餐状态：1为起售 0为停售
    private List<Combos> combos; // 套餐包含的菜品
}