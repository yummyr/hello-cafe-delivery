package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderVO {
    private Long id;
    private String number;// orderNo
    private String userName;  // customer
    private String phone;
    private Double amount;  // order total amount
    private LocalDateTime orderTime;
    private Integer status;
    // private Long userId;                       // 用户id
    // private Long addressBookId;                // 地址簿id
    // private LocalDateTime checkoutTime;        // 结账时间
    // private Integer payMethod;                 // 支付方式
    // private Integer payStatus;                 // 支付状态
    // private String remark;                     // 备注
    // private String address;                    // 地址
    // private String consignee;                  // 收货人
    // private String cancelReason;               // 取消原因
    // private String rejectionReason;            // 拒单原因
    // private LocalDateTime cancelTime;          // 取消时间
    // private LocalDateTime estimatedDeliveryTime; // 预计送达时间
    // private Integer deliveryStatus;            // 配送状态
    // private LocalDateTime deliveryTime;        // 派送时间
    // private Integer packAmount;                // 打包费
    // private Integer tablewareNumber;           // 餐具数量
    // private Integer tablewareStatus;           // 餐具状态
    // private String orderDishes;                      // 订单菜品（字符串形式）
    // private List<OrderDetailVO> orderDetailList;     // 订单详情列表
}