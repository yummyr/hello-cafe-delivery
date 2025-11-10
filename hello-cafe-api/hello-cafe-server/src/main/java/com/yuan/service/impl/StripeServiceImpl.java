package com.yuan.service.impl;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.yuan.service.StripeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class StripeServiceImpl implements StripeService {

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${server.port:8080}")
    private int serverPort;

    private static final String SUCCESS_URL = "payment/success";
    private static final String CANCEL_URL = "payment/cancel";

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
        log.info("Stripe service initialized with key prefix: {}",
                stripeSecretKey != null ? stripeSecretKey.substring(0, Math.min(10, stripeSecretKey.length())) : "null");
    }

    @Override
    public String createPaymentSession(Long orderId, BigDecimal amount, String orderNumber) throws StripeException {
        log.info("Creating Stripe payment session for order: {}, amount: {}", orderId, amount);

        // 转换为分（Stripe使用最小货币单位）
        long amountInCents = amount.multiply(new BigDecimal(100)).longValue();

        // 创建商品项
        SessionCreateParams.LineItem.PriceData.ProductData productData =
            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                .setName("订单 #" + orderNumber)
                .setDescription("Hello Cafe Delivery - 订单支付")
                .build();

        SessionCreateParams.LineItem.PriceData priceData =
            SessionCreateParams.LineItem.PriceData.builder()
                .setCurrency("usd") // 可以根据需要修改为其他货币
                .setUnitAmount(amountInCents)
                .setProductData(productData)
                .build();

        SessionCreateParams.LineItem lineItem =
            SessionCreateParams.LineItem.builder()
                .setPrice(String.valueOf(priceData))
                .setQuantity(1L)
                .build();

        // 添加元数据用于后续验证
        Map<String, String> metadata = new HashMap<>();
        metadata.put("order_id", orderId.toString());
        metadata.put("order_number", orderNumber);

        SessionCreateParams params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .addLineItem(lineItem)
            .setSuccessUrl(buildRedirectUrl("success", orderId))
            .setCancelUrl(buildRedirectUrl("cancel", orderId))
            .setExpiresAt(System.currentTimeMillis() / 1000 + 3600) // 1小时后过期
            .putAllMetadata(metadata)
            .build();

        Session session = Session.create(params);
        log.info("Created Stripe session: {} for order: {}", session.getId(), orderId);

        return session.getUrl();
    }

    @Override
    public boolean verifyPayment(String sessionId) throws StripeException {
        log.info("Verifying payment for session: {}", sessionId);

        Session session = Session.retrieve(sessionId);

        if (session == null) {
            log.warn("Session not found: {}", sessionId);
            return false;
        }

        boolean isPaid = "complete".equals(session.getStatus()) &&
                        session.getPaymentIntent() != null &&
                        "succeeded".equals(session.getPaymentStatus());

        log.info("Payment verification for session {}: status={}, paymentStatus={}, isPaid={}",
                sessionId, session.getStatus(), session.getPaymentStatus(), isPaid);

        return isPaid;
    }

    @Override
    public String buildRedirectUrl(String type, Long orderId) {
        String baseUrl = "http://localhost:" + serverPort + "/api/user/order";

        switch (type.toLowerCase()) {
            case "success":
                return baseUrl + "/" + SUCCESS_URL + "?session_id={CHECKOUT_SESSION_ID}&order_id=" + orderId;
            case "cancel":
                return baseUrl + "/" + CANCEL_URL + "?order_id=" + orderId;
            default:
                throw new IllegalArgumentException("Invalid redirect type: " + type);
        }
    }
}