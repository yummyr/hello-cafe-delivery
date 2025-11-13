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
    // private Long userId;                       // user id
    // private Long addressBookId;                // address book id
    // private LocalDateTime checkoutTime;        // checkout time
    // private Integer payMethod;                 // payment method
    // private Integer payStatus;                 // payment status
    // private String remark;                     // remark
    // private String address;                    // address
    // private String consignee;                  // consignee
    // private String cancelReason;               // cancel reason
    // private String rejectionReason;            // rejection reason
    // private LocalDateTime cancelTime;          // cancel time
    // private LocalDateTime estimatedDeliveryTime; // estimated delivery time
    // private Integer deliveryStatus;            // delivery status
    // private LocalDateTime deliveryTime;        // delivery time
    // private Integer packAmount;                // packing fee
    // private Integer tablewareNumber;           // tableware number
    // private Integer tablewareStatus;           // tableware status
    // private String orderDishes;                      // order dishes (string format)
    // private List<OrderDetailVO> orderDetailList;     // order detail list
}