package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderSubmitVO {
    private Long id;                   // order id
    private String orderNumber;        // order number
    private Double orderAmount;        // order amount
    private LocalDateTime orderTime;   // order place time
}