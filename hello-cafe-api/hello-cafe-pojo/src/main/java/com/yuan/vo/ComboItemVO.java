package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComboItemVO {
    private Long id;
    private Long menuItemId;
    private String name;
    private Double price;
    private String image;
    private Integer quantity;
}