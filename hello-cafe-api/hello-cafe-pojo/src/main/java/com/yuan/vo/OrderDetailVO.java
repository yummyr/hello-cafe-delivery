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
    private String userName;
    private String phone;
    private String address;
    private Integer status;
    private Integer payStatus;
    private Integer payMethod;
    private List<OrderItemVO> orderItems;



}
