package com.yuan.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "menu_item")
public class MenuItem implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 64, unique = true, nullable = false)
    private String name;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(precision = 10)
    private Double price;

    @Column(length = 255)
    private String image;

    @Column(length = 255)
    private String description;

    @Column
    private Integer status; // 1 active, 0 inactive

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;

    @Column(name = "create_employee")
    private Long createEmployee;

    @Column(name = "update_employee")
    private Long updateEmployee;
}

