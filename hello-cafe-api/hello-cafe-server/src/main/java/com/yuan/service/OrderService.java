package com.yuan.service;

import com.yuan.dto.*;
import com.yuan.entity.Orders;
import com.yuan.result.PageResult;
import com.yuan.vo.*;
import com.stripe.exception.StripeException;

import java.util.List;

public interface OrderService {
    /**
     * order page query
     */
    PageResult conditionSearch(OrderPageQueryDTO orderPageQueryDTO);

    /**
     * order details query
     */
    OrderDetailVO getOrderDetails(Long id);

    /**
     * order statistics query
     */
    OrderStatisticsVO statistics();

    /**
     * confirm order
     */
    void confirm(OrdersOperateDTO ordersOperateDTO);

    /**
     * reject order
     */
    void rejection(OrdersOperateDTO ordersRejectionDTO);

    /**
     * cancel order
     */
    void cancel(OrdersOperateDTO ordersCancelDTO);

    /**
     * delivery order
     */
    void delivery(Long id);

    /**
     * complete order
     */
    void complete(Long id);

    Orders findById(Long id);

    /**
     * get waiting acceptance orders
     */
    WaitingAcceptanceVO getWaitingAcceptanceOrders();

    // ========== User Order Methods ==========

    /**
     * User submits order
     */
    OrderSubmitVO submitOrder(OrdersSubmitDTO ordersSubmitDTO);

    /**
     * Order payment
     */
    OrderPaymentVO payment(OrdersPaymentDTO ordersPaymentDTO) throws StripeException;

    /**
     * Get order details (user side)
     */
    OrderVO getOrderDetail(Long id);

    /**
     * Historical order query (user side)
     */
    PageResult historyOrders(Integer page, Integer pageSize, Integer status);

    /**
     * Cancel order (user side)
     */
    void cancelOrder(Long id);

    /**
     * Order again
     */
    void repetitionOrder(Long id);

    /**
     * Remind order
     */
    void reminderOrder(Long id);

}