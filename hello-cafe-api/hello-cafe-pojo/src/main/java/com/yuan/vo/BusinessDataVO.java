package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusinessDataVO {
    // today's business data
    private Double revenue;              // total revenue
    private Integer validOrderCount;      // valid order count
    private Double orderCompletionRate;   // order completion rate
    private Double unitPrice;             // average unit price
    private Integer newUsers;             // new users
    private Integer totalOrders;          // totalOrders
    private Integer pendingOrders;         // pendingOrders
    private Integer deliveringOrders;       // deliveredOrders
    private Integer completedOrders;       // completedOrders
    private Integer cancelledOrders;       // cancelledOrders


}