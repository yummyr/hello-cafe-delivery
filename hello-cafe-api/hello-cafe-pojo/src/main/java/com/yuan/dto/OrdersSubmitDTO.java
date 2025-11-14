package com.yuan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdersSubmitDTO {
    private Long addressBookId;           // Address book id
    private Double amount;                 // Total amount
    private Integer deliveryStatus;        // Delivery status: 1 immediate delivery, 0 specific time
    private String estimatedDeliveryTime; // Estimated delivery time
    private Double deliveryFee;           // Delivery fee
    private Integer payMethod;             // Payment method
    private String remark;                 // Remarks
    private Integer tablewareNumber;       // Tableware quantity
    private Integer tablewareStatus;       // Tableware status: 1 by meal portion, 0 specific quantity
}