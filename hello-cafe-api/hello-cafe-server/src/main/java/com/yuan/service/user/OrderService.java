package com.yuan.service.user;

import com.yuan.dto.OrdersPaymentDTO;
import com.yuan.dto.OrdersSubmitDTO;
import com.yuan.vo.OrderPaymentVO;
import com.yuan.vo.OrderVO;
import com.yuan.vo.OrderSubmitVO;
import com.yuan.result.PageResult;
import com.stripe.exception.StripeException;

import java.util.List;

public interface OrderService {
    /**
     * 用户下单
     */
    OrderSubmitVO submitOrder(OrdersSubmitDTO ordersSubmitDTO);

    /**
     * 订单支付
     */
    OrderPaymentVO payment(OrdersPaymentDTO ordersPaymentDTO) throws StripeException;

    /**
     * 查询订单详情
     */
    OrderVO getOrderDetail(Long id);

    /**
     * 历史订单查询
     */
    PageResult historyOrders(Integer page, Integer pageSize, Integer status);

    /**
     * 取消订单
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