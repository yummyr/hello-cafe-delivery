package com.yuan.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderPageQueryDTO {
    private Integer page = 1;
    private Integer pageSize = 5;
    private String number;            // order number
    private Integer status;           // order status
    private LocalDateTime beginTime = LocalDateTime.of(2000, 1, 1, 0, 0);  // beginTime
    private LocalDateTime endTime = LocalDateTime.now();    // endTime
}