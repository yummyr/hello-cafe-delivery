package com.yuan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "category")
public class Category implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 32, unique = true, nullable = false)
    private String name;

    @Column
    private Integer type; // 1: menu category, 2: combo category

    @Column
    private Integer sort; // keyword using to sort display

    @Column
    private Integer status; // 1 active, 0 inactive

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;

    @Column(name = "create_employee")
    private Long createEmployee; // employee id who created the category

    @Column(name = "update_employee")
    private Long updateEmployee; // last employee id who updated the category
}