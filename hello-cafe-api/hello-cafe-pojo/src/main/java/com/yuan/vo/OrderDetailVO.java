package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailVO {
    private String orderNo;
    private LocalDateTime orderTime;
    private Long addressBookId;
    private String addressName;  // name from address book
    private String addressPhone;  // phone from address book
    private String address;      // full address from address book (city, state, zipcode)
    private String addressDetail; // street address from address book
    private Double amount;         // order total amount
    private Double deliveryFee;    // delivery fee
    private Integer status;
    private Integer payStatus;
    private Integer payMethod;
    private List<OrderItemVO> orderItems;



}
