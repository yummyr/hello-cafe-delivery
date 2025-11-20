package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderVO {
    private Long id;
    private String number;// orderNo
    private Long addressBookId;  // address book id
    private String addressName;  // name from address book
    private String addressPhone;  // phone from address book
    private String address;      // full address from address book
    private Double amount;  // order total amount
    private Double deliveryFee; // delivery fee
    private LocalDateTime orderTime;
    private Integer status;
}