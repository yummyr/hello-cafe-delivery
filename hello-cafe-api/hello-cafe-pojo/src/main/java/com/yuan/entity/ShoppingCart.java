package com.yuan.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "shopping_cart")
public class ShoppingCart implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 64)
    private String name;

    @Column(length = 255)
    private String image;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "menu_item_id")
    private Long menuItemId;

    @Column(name = "combo_id")
    private Long comboId;

    @Column
    private Integer quantity;

    @Column(name = "unit_price", precision = 10)
    private Double unitPrice;

    @Column(name = "create_time")
    private LocalDateTime createTime;
}
