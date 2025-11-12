package com.yuan.service;

import com.yuan.dto.*;
import com.yuan.entity.Orders;
import com.yuan.result.PageResult;
import com.yuan.vo.*;

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

}