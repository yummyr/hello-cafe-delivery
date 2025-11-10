package com.yuan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "address_book")
public class AddressBook extends BaseEntity {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(length = 50)
    private String consignee;  // 收货人

    @Column(length = 10)
    private String sex;        // 性别

    @Column(length = 15)
    private String phone;      // 手机号

    @Column(name = "province_code", length = 12)
    private String provinceCode; // 省份编码

    @Column(name = "province_name", length = 32)
    private String provinceName; // 省份名称

    @Column(name = "city_code", length = 12)
    private String cityCode;     // 城市编码

    @Column(name = "city_name", length = 32)
    private String cityName;     // 城市名称

    @Column(name = "district_code", length = 12)
    private String districtCode; // 区县编码

    @Column(name = "district_name", length = 32)
    private String districtName; // 区县名称

    @Column(length = 200)
    private String detail;      // 详细地址

    @Column(length = 100)
    private String label;       // 标签

    @Column(name = "is_default")
    private Integer isDefault;  // 是否默认地址 0-否 1-是
}
