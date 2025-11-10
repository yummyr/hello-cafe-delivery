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
@RequestMapping("/user/order/payment")
@RequiredArgsConstructor
@Slf4j
public class UserPaymentController {

    private final OrdersRepository ordersRepository;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @PostMapping("/webhook")
    @Operation(summary = "Stripe支付Webhook")
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
    @Operation(summary = "支付成功页面")
    public String paymentSuccess(@RequestParam String session_id, @RequestParam Long order_id) {
        log.info("Payment success for session: {}, order: {}", session_id, order_id);

        // 这里可以重定向到前端的成功页面
        return "Payment successful! Order ID: " + order_id;
    }

    @GetMapping("/cancel")
    @Operation(summary = "支付取消页面")
    public String paymentCancel(@RequestParam Long order_id) {
        log.info("Payment cancelled for order: {}", order_id);

        // 这里可以重定向到前端的取消页面
        return "Payment cancelled! Order ID: " + order_id;
    }

    private void handleSuccessfulPayment(Session session) {
        String orderIdStr = session.getMetadata().get("order_id");
        if (orderIdStr != null) {
            Long orderId = Long.valueOf(orderIdStr);

            log.info("Processing successful payment for order: {}, session: {}", orderId, session.getId());

            // 更新订单状态为已支付
            OrdersRepository ordersRepository = this.ordersRepository;
            ordersRepository.findById(orderId).ifPresent(order -> {
                order.setPayStatus(1); // 已支付
                order.setStatus(2); // 待处理
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

            // 可以在这里处理支付过期的逻辑
            // 例如将订单状态更新为已过期或保持待付款状态
        }
    }
}