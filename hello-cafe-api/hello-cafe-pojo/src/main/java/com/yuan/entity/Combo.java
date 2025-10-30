package com.yuan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "combo")
public class Combo extends BaseEntity {


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


}