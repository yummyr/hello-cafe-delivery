package com.yuan.vo;

import com.yuan.entity.MenuItemFlavor;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemVO {
    private String name;
    private String image;
    private String comboName;
    private Integer quantity;
    private Double unitPrice;
    private double tax;
    private List<MenuItemFlavor> flavor;
}