package com.yuan.service.impl;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.param.*;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.net.Webhook;
import com.yuan.constant.OrderStatusConstant;
import com.yuan.entity.Orders;
import com.yuan.repository.OrdersRepository;
import com.yuan.service.StripeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class StripeServiceImpl implements StripeService {

    private final OrdersRepository ordersRepository;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${stripe.publishable-key}")
    private String stripePublishableKey;

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public String createPaymentSession(Long orderId, BigDecimal amount, String orderNumber) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        // Convert amount to cents (Stripe uses cents)
        Long amountInCents = amount.multiply(new BigDecimal("100")).longValue();

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(buildRedirectUrl("success", orderId))
                .setCancelUrl(buildRedirectUrl("cancel", orderId))
                .setCustomerEmail(getOrderCustomerEmail(orderId))
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd") // Default to USD, can be made configurable
                                                .setUnitAmount(amountInCents)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Order #" + orderNumber)
                                                                .setDescription("Payment for order " + orderNumber)
                                                                .build()
                                                ).build()
                                ).build()
                ).build();

        Session session = Session.create(params);
        log.info("Created Stripe payment session for order {}: {}", orderId, session.getId());

        // Update order with stripe session ID
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setStripeSessionId(session.getId());
        ordersRepository.save(order);

        return session.getUrl();
    }

    @Override
    public boolean verifyPayment(String sessionId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        try {
            Session session = Session.retrieve(sessionId);
            return "complete".equals(session.getStatus()) && session.getPaymentIntent() != null;
        } catch (Exception e) {
            log.error("Error verifying payment for session {}: {}", sessionId, e.getMessage());
            return false;
        }
    }

    @Override
    public String buildRedirectUrl(String type, Long orderId) {
        return String.format("%s/payment/%s?orderId=%d", frontendUrl, type, orderId);
    }

    /**
     * Create PaymentIntent for direct client-side payment
     */
    public Map<String, Object> createPaymentIntent(Long amount, String currency, String orderId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        PaymentIntentCreateParams.Builder paramsBuilder = PaymentIntentCreateParams.builder()
                .setAmount(amount) // unit is cents, for example: 10.00 USD = 1000
                .setCurrency(currency.toLowerCase())
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                );

        // Add metadata if orderId is provided
        if (orderId != null && !orderId.isEmpty() && !"unknown".equals(orderId)) {
            paramsBuilder.putMetadata("orderId", orderId);
        }

        PaymentIntentCreateParams params = paramsBuilder.build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);
        Map<String, Object> response = new HashMap<>();
        response.put("clientSecret", paymentIntent.getClientSecret());
        response.put("paymentIntentId", paymentIntent.getId());
        return response;
    }

    /**
     * Confirm payment and update order status
     */
    public boolean confirmPayment(String paymentIntentId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

            if ("succeeded".equals(paymentIntent.getStatus())) {
                // Get order ID from metadata
                String orderId = paymentIntent.getMetadata().get("orderId");
                if (orderId != null && !"unknown".equals(orderId)) {
                    updateOrderPaymentStatus(Long.parseLong(orderId), paymentIntentId);
                }
                return true;
            }
            return false;
        } catch (Exception e) {
            log.error("Error confirming payment for payment intent {}: {}", paymentIntentId, e.getMessage());
            return false;
        }
    }

    /**
     * Process webhook event from Stripe
     */
    public void processWebhookEvent(String payload, String sigHeader, String webhookSecret) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

        log.info("Processing Stripe webhook event: {}", event.getType());

        switch (event.getType()) {
            case "payment_intent.succeeded":
                PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer().getObject().get();
                handlePaymentSucceeded(paymentIntent);
                break;
            case "payment_intent.payment_failed":
                PaymentIntent failedPaymentIntent = (PaymentIntent) event.getDataObjectDeserializer().getObject().get();
                handlePaymentFailed(failedPaymentIntent);
                break;
            case "checkout.session.completed":
                Session session = (Session) event.getDataObjectDeserializer().getObject().get();
                handleCheckoutSessionCompleted(session);
                break;
            default:
                log.info("Unhandled event type: {}", event.getType());
        }
    }

    private void handlePaymentSucceeded(PaymentIntent paymentIntent) {
        try {
            String orderId = paymentIntent.getMetadata().get("orderId");
            if (orderId != null && !"unknown".equals(orderId)) {
                updateOrderPaymentStatus(Long.parseLong(orderId), paymentIntent.getId());
                log.info("Payment succeeded for order: {}, payment intent: {}", orderId, paymentIntent.getId());
            }
        } catch (Exception e) {
            log.error("Error handling payment succeeded: {}", e.getMessage());
        }
    }

    private void handlePaymentFailed(PaymentIntent paymentIntent) {
        try {
            String orderId = paymentIntent.getMetadata().get("orderId");
            if (orderId != null && !"unknown".equals(orderId)) {
                updateOrderPaymentFailed(Long.parseLong(orderId), paymentIntent.getId());
                log.info("Payment failed for order: {}, payment intent: {}", orderId, paymentIntent.getId());
            }
        } catch (Exception e) {
            log.error("Error handling payment failed: {}", e.getMessage());
        }
    }

    private void handleCheckoutSessionCompleted(Session session) {
        try {
            if (session.getPaymentIntent() != null) {
                // Find order by stripe session ID
                Orders order = ordersRepository.findByStripeSessionId(session.getId())
                        .orElseThrow(() -> new RuntimeException("Order not found for session: " + session.getId()));

                updateOrderPaymentStatus(order.getId(), session.getPaymentIntent());
                log.info("Checkout session completed for order: {}, session: {}", order.getId(), session.getId());
            }
        } catch (Exception e) {
            log.error("Error handling checkout session completed: {}", e.getMessage());
        }
    }

    private void updateOrderPaymentStatus(Long orderId, String paymentIntentId) {
        try {
            Orders order = ordersRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

            order.setStatus(OrderStatusConstant.AWAITING_ACCEPTANCE); // wait for restaurant to accept order status
            order.setPayStatus(1); // PAID status
            order.setStripePaymentIntentId(paymentIntentId);
            order.setPaymentTime(new Date());

            ordersRepository.save(order);
            log.info("Updated order {} status to PENDING_RESTAURANT (2) with payment intent: {}", orderId, paymentIntentId);
        } catch (Exception e) {
            log.error("Error updating order payment status: {}", e.getMessage());
        }
    }

    private void updateOrderPaymentFailed(Long orderId, String paymentIntentId) {
        try {
            Orders order = ordersRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

            order.setStatus(0); // PAYMENT_FAILED status (assuming 0 = FAILED)
            order.setStripePaymentIntentId(paymentIntentId);

            ordersRepository.save(order);
            log.info("Updated order {} status to PAYMENT_FAILED with payment intent: {}", orderId, paymentIntentId);
        } catch (Exception e) {
            log.error("Error updating order payment failed status: {}", e.getMessage());
        }
    }

    private String getOrderCustomerEmail(Long orderId) {
        try {
            Orders order = ordersRepository.findById(orderId).orElse(null);
            // Here you would typically get email from user associated with the order
            // For now, return null to let Stripe handle it
            return null;
        } catch (Exception e) {
            return null;
        }
    }
}
