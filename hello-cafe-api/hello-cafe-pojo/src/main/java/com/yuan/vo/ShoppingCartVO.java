package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingCartVO {
    private Long id;
    private String name;
    private String image;
    private Long userId;
    private Long menuItemId;
    private Long comboId;
    private Integer quantity;
    private BigDecimal unitPrice;
    private String flavor;
    private LocalDateTime createTime;
}