package com.yuan.controller.user;

import com.yuan.dto.OrdersPaymentDTO;
import com.yuan.dto.OrdersSubmitDTO;
import com.yuan.result.PageResult;
import com.yuan.result.Result;
import com.yuan.service.OrderService;
import com.yuan.vo.OrderPaymentVO;
import com.yuan.vo.OrderSubmitVO;
import com.yuan.vo.OrderVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/order")
@RequiredArgsConstructor
@Slf4j
public class UserOrderController {

    private final OrderService orderService;

    @PostMapping("/submit")
    public Result<OrderSubmitVO> submit(@RequestBody OrdersSubmitDTO ordersSubmitDTO) {
        log.info("submit order：{}", ordersSubmitDTO);
        OrderSubmitVO orderSubmitVO = orderService.submitOrder(ordersSubmitDTO);
        return Result.success(orderSubmitVO);
    }

    @PostMapping("/payment")
    public Result<OrderPaymentVO> payment(@RequestBody OrdersPaymentDTO ordersPaymentDTO) throws Exception {
        log.info("make payment：{}", ordersPaymentDTO);
        OrderPaymentVO orderPaymentVO = orderService.payment(ordersPaymentDTO);
        return Result.success(orderPaymentVO);
    }

    @GetMapping("/orderDetail/{id}")
    public Result<OrderVO> orderDetail(@PathVariable Long id) {
        log.info("check order detail by id：{}", id);
        OrderVO orderVO = orderService.getOrderDetail(id);
        return Result.success(orderVO);
    }

    @GetMapping("/historyOrders")
    public Result<PageResult> historyOrders(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) Integer status) {
        log.info("History orders：page={}, pageSize={}, status={}", page, pageSize, status);
        PageResult pageResult = orderService.historyOrders(page, pageSize, status);
        return Result.success(pageResult);
    }

    @PutMapping("/cancel/{id}")
    public Result cancel(@PathVariable Long id, @RequestParam String reason) {
        log.info("User cancel order by id：{}，, reason: {}", id, reason);
        orderService.cancelOrder(id, reason);
        return Result.success();
    }

    @PostMapping("/repetition/{id}")
    public Result repetition(@PathVariable Long id) {
        log.info("User repetition order by id：{}", id);
        orderService.repetitionOrder(id);
        return Result.success();
    }

    @GetMapping("/reminder/{id}")
    public Result reminder(@PathVariable Long id) {
        log.info("User reminder order by id：{}", id);
        orderService.reminderOrder(id);
        return Result.success();
    }
}