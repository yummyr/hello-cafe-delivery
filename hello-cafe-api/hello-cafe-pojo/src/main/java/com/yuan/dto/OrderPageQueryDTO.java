package com.yuan.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderPageQueryDTO {
    private Integer page = 1;         // 页码
    private Integer pageSize = 5;    // 每页记录数
    private String number;            // 订单号
    private String phone;             // 手机号
    private Integer status;           // 订单状态
    private LocalDateTime beginTime = LocalDateTime.of(2000, 1, 1, 0, 0);  // 开始时间
    private LocalDateTime endTime = LocalDateTime.now();    // 结束时间
}