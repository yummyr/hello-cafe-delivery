package com.yuan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdersPaymentDTO {
    private String orderNumber; // 订单号
    private Integer payMethod;   // 支付方式
}