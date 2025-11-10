package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderSubmitVO {
    private Long id;                   // 订单id
    private String orderNumber;        // 订单号
    private Double orderAmount;        // 订单金额
    private LocalDateTime orderTime;   // 下单时间
}