package com.yuan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Employee entity for Hello Cafe Delivery.
 * Represents cafe staff information such as manager, cashier, barista, etc.
 */
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "employee")
public class Employee implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 32)
    private String name;

    @Column(nullable = false, length = 32, unique = true)
    private String username;

    @Column(nullable = false, length = 64)
    private String password;

    @Column(length = 15)
    private String phone;

    @Column(length = 10)
    private String gender;

    @Column
    private Integer status;  // 1 active, 0 inactive

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;

    @Column(name = "create_user")
    private Long createUser;

    @Column(name = "update_user")
    private Long updateUser;
}