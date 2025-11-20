package com.yuan.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name = "orders")
public class Orders implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String number;

    @Column
    private Integer status; // 1 pending payment, 2 awaiting acceptance, 3 accepted, 4 delivering, 5 completed, 6 canceled

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "address_book_id")
    private Long addressBookId;

    @Column(name = "order_time")
    private LocalDateTime orderTime;

    @Column(name = "checkout_time")
    private LocalDateTime checkoutTime;

    @Column(name = "pay_method")
    private Integer payMethod; // 1 credit card, 2 PayPal

    @Column(name = "pay_status")
    private Integer payStatus; // 0 unpaid, 1 paid, 2 refunded

    @Column(precision = 10)
    private Double amount;

    @Column()
    private String notes;

    @Column(name = "cancel_reason", length = 255)
    private String cancelReason;


    @Column(name = "cancel_time")
    private LocalDateTime cancelTime;

    @Column(name = "estimated_delivery_time")
    private LocalDateTime estimatedDeliveryTime;

    @Column(name = "delivery_status")
    private Integer deliveryStatus; // 1 deliver immediately, 0 schedule delivery time

    @Column(name = "delivery_time")
    private LocalDateTime deliveryTime;

    @Column(name = "delivery_fee")
    private double deliveryFee;

    @Column(name = "tableware_number")
    private Integer tablewareNumber;

    @Column(name = "tableware_status")
    private Integer tablewareStatus; // 1 provide per meal, 0 custom quantity

    @Column(name = "stripe_session_id", length = 255)
    private String stripeSessionId;

    @Column(name = "stripe_payment_intent_id", length = 255)
    private String stripePaymentIntentId;

    @Column(name = "payment_time")
    private Date paymentTime;

}