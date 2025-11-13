package com.yuan.service;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import java.math.BigDecimal;

public interface StripeService {

    /**
     * Create payment session
     * @param orderId Order ID
     * @param amount Payment amount (in yuan)
     * @param orderNumber Order number
     * @return Stripe payment session URL
     * @throws StripeException Stripe exception
     */
    String createPaymentSession(Long orderId, BigDecimal amount, String orderNumber) throws StripeException;

    /**
     * Verify payment status
     * @param sessionId Stripe session ID
     * @return Whether payment is successful
     * @throws StripeException Stripe exception
     */
    boolean verifyPayment(String sessionId) throws StripeException;

    /**
     * Build success/cancel redirect URL
     * @param type Type (success/cancel)
     * @param orderId Order ID
     * @return Complete URL
     */
    String buildRedirectUrl(String type, Long orderId);
}