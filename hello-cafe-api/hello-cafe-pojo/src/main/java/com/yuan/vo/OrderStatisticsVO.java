package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatisticsVO {
    private Integer toBeConfirmed;     // 待接单数量
    private Integer confirmed;         // 待派送数量
    private Integer deliveryInProgress; // 派送中数量
    private Integer completed;         // 已完成数量
    private Integer canceled;          // 已取消数量
}