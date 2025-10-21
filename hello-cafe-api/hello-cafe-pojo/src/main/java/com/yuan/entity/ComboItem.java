package com.yuan.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Data
@Entity
@Table(name = "combo_item")
public class ComboItem implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "combo_id")
    private Long comboId;

    @Column(name = "menu_item_id")
    private Long menuItemId;

    @Column(length = 64)
    private String name;

    @Column(precision = 10)
    private Double price;

    @Column
    private Integer quantity;
}
