package com.yuan.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Data
@Entity
@Table(name = "address_book")
public class AddressBook implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(length = 50)
    private String name;

    @Column(length = 10)
    private String gender;

    @Column(length = 15)
    private String phone;

    @Column(length = 200)
    private String address;

    @Column(length = 64)
    private String city;

    @Column(length = 64)
    private String state;

    @Column(length = 12)
    private String zipcode;

    @Column(length = 100)
    private String label;

    @Column(name = "is_default")
    private Boolean isDefault;
}
