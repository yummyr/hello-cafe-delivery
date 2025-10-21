package com.yuan.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "shop")
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // 1=open, 0=closed
    private Integer status;

    @Column(name = "update_time")
    private LocalDateTime updateTime;
}
