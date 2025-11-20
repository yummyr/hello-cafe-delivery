package com.yuan.controller.admin;

import com.yuan.dto.*;
import com.yuan.result.PageResult;
import com.yuan.result.Result;
import com.yuan.service.OrderService;
import com.yuan.vo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/admin/orders")
public class OrderController {

    private final OrderService orderService;
    /**
     * page query order with conditions
     * @param orderPageQueryDTO
     * @return page
     */
    @GetMapping("/conditionSearch")
    public Result<PageResult> conditionSearch(OrderPageQueryDTO orderPageQueryDTO) {
        try {
            log.info("Searching orders with conditions: {}", orderPageQueryDTO);
            PageResult result = orderService.conditionSearch(orderPageQueryDTO);
            log.info("Search result: {}", result);
            return Result.success(result);
        } catch (Exception e) {
            log.error("Failed to search orders", e);
            return Result.error("Failed to search orders: " + e.getMessage());
        }
    }

    /**
     * fetch order details
     */
    @GetMapping("/details/{id}")
    public Result<OrderDetailVO> getOrderDetails(@PathVariable Long id) {
        try {
            log.info("Getting order details for id: {}", id);
            OrderDetailVO orderDetail= orderService.getOrderDetails(id);
            log.info("Order details: {}", orderDetail);
            return Result.success(orderDetail);
        } catch (Exception e) {
            log.error("Failed to get order details", e);
            return Result.error("Failed to get order details: " + e.getMessage());
        }
    }

    /**
     * orders statistics with status
     */
    @GetMapping("/statistics")
    public Result<OrderStatisticsVO> statistics() {
        try {
            log.info("Getting order statistics");
            OrderStatisticsVO statistics = orderService.statistics();
            return Result.success(statistics);
        } catch (Exception e) {
            log.error("Failed to get order statistics", e);
            return Result.error("Failed to get order statistics: " + e.getMessage());
        }
    }

    /**
     * confirm order
     */
    @PutMapping("/confirm")
    public Result<Long> confirm(@RequestBody OrdersOperateDTO ordersOperateDTO) {
        try {
            log.info("Confirming order: {}", ordersOperateDTO.getId());
            orderService.confirm(ordersOperateDTO);
            log.info("Order confirmed successfully: {}", Result.success(ordersOperateDTO.getId()));
            return Result.success(ordersOperateDTO.getId());
        } catch (Exception e) {
            log.error("Failed to confirm order", e);
            return Result.error("Failed to confirm order: " + e.getMessage());
        }
    }



    /**
     * cancel order
     */
    @PutMapping("/cancel")
    public Result cancel(@RequestBody OrdersOperateDTO dto) {
        try {
            log.info("Cancelling order: {}, reason: {}", dto.getId(), dto.getReason());
            orderService.cancel(dto);
            return Result.success();
        } catch (Exception e) {
            log.error("Failed to cancel order", e);
            return Result.error("Failed to cancel order: " + e.getMessage());
        }
    }

    /**
     * deliver order to customer
     */
    @PutMapping("/delivery")
    public Result delivery(@RequestBody OrdersOperateDTO dto) {
        try {
            log.info("Delivering order: {}",dto.getId());
            orderService.delivery(dto.getId());
            return Result.success();
        } catch (Exception e) {
            log.error("Failed to deliver order", e);
            return Result.error("Failed to deliver order: " + e.getMessage());
        }
    }

    /**
     * complete order
     */
    @PutMapping("/complete")
    public Result complete(@RequestBody OrdersOperateDTO dto) {
        try {
            log.info("Completing order: {}", dto.getId());
            orderService.complete(dto.getId());
            return Result.success();
        } catch (Exception e) {
            log.error("Failed to complete order", e);
            return Result.error("Failed to complete order: " + e.getMessage());
        }
    }

    /**
     * get waiting acceptance orders
     */
    @GetMapping("/waiting-acceptance")
    public Result<WaitingAcceptanceVO> getWaitingAcceptanceOrders() {
        try {
            log.info("Getting waiting acceptance orders");
            WaitingAcceptanceVO waitingOrders = orderService.getWaitingAcceptanceOrders();
            return Result.success(waitingOrders);
        } catch (Exception e) {
            log.error("Failed to get waiting acceptance orders", e);
            return Result.error("Failed to get waiting acceptance orders: " + e.getMessage());
        }
    }
}