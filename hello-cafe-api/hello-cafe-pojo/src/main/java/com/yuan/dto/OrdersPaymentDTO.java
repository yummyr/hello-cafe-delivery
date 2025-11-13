package com.yuan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdersPaymentDTO {
    private String orderNumber;
    private Integer payMethod;
}