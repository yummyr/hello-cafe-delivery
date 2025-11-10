package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderOverViewVO {
    private Integer waitingOrders;     // 待接单数量
    private Integer deliveredOrders;   // 待派送数量
    private Integer completedOrders;   // 已完成数量
    private Integer cancelledOrders;   // 已取消数量
    private Integer allOrders;         // 全部订单
}