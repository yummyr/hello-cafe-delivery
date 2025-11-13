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
     * 用户下单
     */
    OrderSubmitVO submitOrder(OrdersSubmitDTO ordersSubmitDTO);

    /**
     * 订单支付
     */
    OrderPaymentVO payment(OrdersPaymentDTO ordersPaymentDTO) throws StripeException;

    /**
     * 查询订单详情 (用户端)
     */
    OrderVO getOrderDetail(Long id);

    /**
     * 历史订单查询 (用户端)
     */
    PageResult historyOrders(Integer page, Integer pageSize, Integer status);

    /**
     * 取消订单 (用户端)
     */
    void cancelOrder(Long id);

    /**
     * 再来一单
     */
    void repetitionOrder(Long id);

    /**
     * 催单
     */
    void reminderOrder(Long id);

}