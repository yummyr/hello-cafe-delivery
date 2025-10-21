package com.yuan.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Data
@Entity
@Table(name = "order_detail")
public class OrderDetail implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 64)
    private String name;

    @Column(length = 255)
    private String image;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "menu_item_id")
    private Long menuItemId;

    @Column(name = "combo_id")
    private Long comboId;

    @Column
    private Integer quantity;

    @Column(name = "unit_price", precision = 10)
    private Double unitPrice;

    @Column(precision = 10)
    private Double tax;
}
