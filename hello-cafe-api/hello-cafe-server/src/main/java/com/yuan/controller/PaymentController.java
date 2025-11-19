package com.yuan.controller;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.yuan.entity.Orders;
import com.yuan.result.Result;
import com.yuan.service.OrderService;
import com.yuan.service.impl.StripeServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final StripeServiceImpl stripeService;
    private final OrderService orderService;

    // Using a default webhook secret for testing
    // In production, this should be configured via environment variables
    private String webhookSecret = "whsec_test_default_secret";

    /**
     * Create Payment Intent for direct client-side payment
     */
    @PostMapping("/create-payment-intent")
    public Result<Map<String, Object>> createPaymentIntent(@RequestBody Map<String, Object> request) {
        log.info("start to pay in stripe controller~~{}",request.entrySet());
        try {
            Long amount = ((Number) request.get("amount")).longValue(); // 金额单位：分
            String currency = (String) request.get("currency");
            String orderId = request.get("orderId") != null ? request.get("orderId").toString() : null;

            Map<String, Object> paymentIntent = stripeService.createPaymentIntent(amount, currency, orderId);
            return Result.success(paymentIntent);
        } catch (StripeException e) {
            log.error("Error creating payment intent: {}", e.getMessage());
            return Result.error("Failed to create payment intent: " + e.getMessage());
        }
    }

    /**
     * Create Checkout Session for redirect-based payment
     */
    @PostMapping("/create-checkout-session")
    public Result<String> createCheckoutSession(@RequestBody Map<String, Object> request) {
        try {
            Long orderId = Long.parseLong(request.get("orderId").toString());
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String orderNumber = request.get("orderNumber") != null ?
                request.get("orderNumber").toString() : "ORD-" + orderId;

            String checkoutUrl = stripeService.createPaymentSession(orderId, amount, orderNumber);
            return Result.success(checkoutUrl);
        } catch (Exception e) {
            log.error("Error creating checkout session: {}", e.getMessage());
            return Result.error("Failed to create checkout session: " + e.getMessage());
        }
    }

    /**
     * Confirm payment status
     */
    @PostMapping("/confirm-payment")
    public Result<Boolean> confirmPayment(@RequestBody Map<String, Object> request) {
        try {
            String paymentIntentId = (String) request.get("paymentIntentId");
            boolean confirmed = stripeService.confirmPayment(paymentIntentId);
            return Result.success(confirmed);
        } catch (StripeException e) {
            log.error("Error confirming payment: {}", e.getMessage());
            return Result.error("Failed to confirm payment: " + e.getMessage());
        }
    }

    /**
     * Verify payment session status
     */
    @GetMapping("/verify-session/{sessionId}")
    public Result<Boolean> verifyPayment(@PathVariable String sessionId) {
        try {
            boolean verified = stripeService.verifyPayment(sessionId);
            return Result.success(verified);
        } catch (StripeException e) {
            log.error("Error verifying payment: {}", e.getMessage());
            return Result.error("Failed to verify payment: " + e.getMessage());
        }
    }

    /**
     * Get payment details for an order
     */
    @GetMapping("/order/{orderId}")
    public Result<Map<String, Object>> getOrderPayment(@PathVariable Long orderId) {
        try {
            Orders order = orderService.getOrderById(orderId);

            Map<String, Object> paymentDetails = new HashMap<>();
            paymentDetails.put("orderId", order.getId());
            paymentDetails.put("orderNumber", order.getNumber());
            paymentDetails.put("amount", order.getAmount());
            paymentDetails.put("status", order.getStatus());
            paymentDetails.put("payStatus", order.getPayStatus());
            paymentDetails.put("stripeSessionId", order.getStripeSessionId());
            paymentDetails.put("stripePaymentIntentId", order.getStripePaymentIntentId());
            paymentDetails.put("paymentTime", order.getPaymentTime());

            return Result.success(paymentDetails);
        } catch (Exception e) {
            log.error("Error getting order payment details: {}", e.getMessage());
            return Result.error("Failed to get payment details: " + e.getMessage());
        }
    }

    /**
     * Stripe Webhook endpoint
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload, HttpServletRequest request) {
        try {
            String sigHeader = request.getHeader("Stripe-Signature");

            if (sigHeader == null) {
                log.warn("Missing Stripe signature header");
                return ResponseEntity.badRequest().build();
            }

            // Process the webhook event
            stripeService.processWebhookEvent(payload, sigHeader, webhookSecret);

            return ResponseEntity.ok().build();
        } catch (SignatureVerificationException e) {
            log.error("Invalid webhook signature: {}", e.getMessage());
            return ResponseEntity.status(401).build();
        } catch (Exception e) {
            log.error("Error processing webhook: {}", e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Test endpoint for webhook validation
     */
    @GetMapping("/webhook/test")
    public Result<String> testWebhook() {
        return Result.success("Webhook endpoint is accessible");
    }
}
