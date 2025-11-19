package com.yuan.controller.user;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.yuan.repository.OrdersRepository;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/order/payment")
@RequiredArgsConstructor
@Slf4j
public class UserPaymentController {

    private final OrdersRepository ordersRepository;

    // Using a default webhook secret for testing
    // In production, this should be configured via environment variables
    private String webhookSecret = "whsec_test_default_secret";

    @PostMapping("/webhook")
    @Operation(summary = "Stripe payment webhook")
    public String handleStripeWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        log.info("Received Stripe webhook");

        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

            switch (event.getType()) {
                case "checkout.session.completed":
                    Session session = (Session) event.getDataObjectDeserializer().getObject().orElseThrow();
                    handleSuccessfulPayment(session);
                    break;
                case "checkout.session.expired":
                    Session expiredSession = (Session) event.getDataObjectDeserializer().getObject().orElseThrow();
                    handleExpiredPayment(expiredSession);
                    break;
                default:
                    log.info("Unhandled event type: {}", event.getType());
            }

        } catch (SignatureVerificationException e) {
            log.error("Webhook signature verification failed", e);
            return "Invalid signature";
        } catch (Exception e) {
            log.error("Error processing webhook", e);
            return "Error processing webhook";
        }

        return "OK";
    }

    @GetMapping("/success")
    @Operation(summary = "Payment success page")
    public String paymentSuccess(@RequestParam String session_id, @RequestParam Long order_id) {
        log.info("Payment success for session: {}, order: {}", session_id, order_id);

        // Can redirect to frontend success page here
        return "Payment successful! Order ID: " + order_id;
    }

    @GetMapping("/cancel")
    @Operation(summary = "Payment cancel page")
    public String paymentCancel(@RequestParam Long order_id) {
        log.info("Payment cancelled for order: {}", order_id);

        // Can redirect to frontend cancel page here
        return "Payment cancelled! Order ID: " + order_id;
    }

    private void handleSuccessfulPayment(Session session) {
        String orderIdStr = session.getMetadata().get("order_id");
        if (orderIdStr != null) {
            Long orderId = Long.valueOf(orderIdStr);

            log.info("Processing successful payment for order: {}, session: {}", orderId, session.getId());

            // Update order status to paid
            OrdersRepository ordersRepository = this.ordersRepository;
            ordersRepository.findById(orderId).ifPresent(order -> {
                order.setPayStatus(1); // Paid
                order.setStatus(2); // Pending processing
                order.setCheckoutTime(java.time.LocalDateTime.now());
                ordersRepository.save(order);
                log.info("Updated order {} to paid status", orderId);
            });
        }
    }

    private void handleExpiredPayment(Session session) {
        String orderIdStr = session.getMetadata().get("order_id");
        if (orderIdStr != null) {
            Long orderId = Long.valueOf(orderIdStr);
            log.info("Payment expired for order: {}, session: {}", orderId, session.getId());

            // Can handle payment expiration logic here
            // For example, update order status to expired or keep pending payment status
        }
    }
}