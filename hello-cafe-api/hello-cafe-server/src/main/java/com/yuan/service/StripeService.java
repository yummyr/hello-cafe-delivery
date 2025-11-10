package com.yuan.service;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import java.math.BigDecimal;

public interface StripeService {

    /**
     * 创建支付会话
     * @param orderId 订单ID
     * @param amount 支付金额（元）
     * @param orderNumber 订单号
     * @return Stripe支付会话URL
     * @throws StripeException Stripe异常
     */
    String createPaymentSession(Long orderId, BigDecimal amount, String orderNumber) throws StripeException;

    /**
     * 验证支付状态
     * @param sessionId Stripe会话ID
     * @return 是否支付成功
     * @throws StripeException Stripe异常
     */
    boolean verifyPayment(String sessionId) throws StripeException;

    /**
     * 构建成功/取消重定向URL
     * @param type 类型（success/cancel）
     * @param orderId 订单ID
     * @return 完整的URL
     */
    String buildRedirectUrl(String type, Long orderId);
}