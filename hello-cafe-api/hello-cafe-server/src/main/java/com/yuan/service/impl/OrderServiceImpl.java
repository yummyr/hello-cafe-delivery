package com.yuan.service.impl;

import com.yuan.constant.OrderStatusConstant;
import com.yuan.dto.*;
import com.yuan.entity.*;
import com.yuan.repository.*;
import com.yuan.result.PageResult;
import com.yuan.service.OrderService;
import com.yuan.vo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrdersRepository ordersRepository;
    private final OrderDetailRepository orderDetailRepository;

    private final ComboRepository comboRepository;
    private final MenuItemFlavorRepository menuItemFlavorRepository;



    @Override
    public PageResult conditionSearch(OrderPageQueryDTO dto) {
        if (dto == null) {
            dto = new OrderPageQueryDTO();
        }
        Pageable pageable = PageRequest.of(
                dto.getPage() - 1,
                dto.getPageSize(),
                Sort.by(Sort.Direction.DESC, "orderTime")
        );

        Page<Orders> page = ordersRepository.findAll(dto.getNumber(), dto.getPhone(), dto.getStatus(), dto.getBeginTime(), dto.getEndTime(), pageable);

        // 转换为OrderVO
        List<OrderVO> voList = page.getContent().stream()
                .map(order -> new OrderVO(order.getId(), order.getNumber(), order.getUserName(), order.getPhone(), order.getAmount(),
                        order.getOrderTime(), order.getStatus()))
                .toList();

        log.info("Total orders: {}", page.getTotalElements());
        log.info("Total pages: {}", page.getTotalPages());
        log.info("查询结果Orders: {}", voList.toString());
        return new PageResult(page.getTotalElements(), voList);
    }

    @Override
    public OrderDetailVO getOrderDetails(Long id) {
        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));


        // check order details
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(id);
        List<OrderItemVO> orderItemVOS = orderDetails.stream()
                .map(this::convertToOrderDetailVO)
                .collect(Collectors.toList());

        OrderDetailVO orderDetailVO = new OrderDetailVO();
        orderDetailVO.setOrderItems(orderItemVOS);
        orderDetailVO.setOrderNo(order.getNumber());
        orderDetailVO.setOrderTime(order.getOrderTime());
        orderDetailVO.setPayStatus(order.getPayStatus());
        orderDetailVO.setPhone(order.getPhone());
        orderDetailVO.setAddress(order.getAddress());
        orderDetailVO.setUserName(order.getUserName());
        orderDetailVO.setStatus(order.getStatus());
        orderDetailVO.setPayMethod(order.getPayMethod());

        return orderDetailVO;
    }

    @Override
    public OrderStatisticsVO statistics() {

        Long toBeConfirmed = ordersRepository.countByStatus(OrderStatusConstant.AWAITING_ACCEPTANCE);
        Long confirmed = ordersRepository.countByStatus(OrderStatusConstant.ACCEPTED);
        Long deliveryInProgress = ordersRepository.countByStatus(OrderStatusConstant.DELIVERING);
        Long completed = ordersRepository.countByStatus(OrderStatusConstant.COMPLETED);
        Long cancelled = ordersRepository.countByStatus(OrderStatusConstant.CANCELED);


        log.info("toBeConfirmed: {}, confirmed: {}, deliveryInProgress: {}", toBeConfirmed, confirmed, deliveryInProgress);
        return new OrderStatisticsVO(
                toBeConfirmed.intValue(),
                confirmed.intValue(),
                deliveryInProgress.intValue(),
                completed.intValue(),
                cancelled.intValue()
        );
    }

    @Override
    @Transactional
    public void confirm(OrdersOperateDTO ordersOperateDTO) {
        Orders order = ordersRepository.findById(ordersOperateDTO.getId())
                .orElseThrow(() -> new RuntimeException("Order not found: " + ordersOperateDTO.getId()));

        // check order status if it is not awaiting acceptance then throw exception
        if (order.getStatus() != OrderStatusConstant.AWAITING_ACCEPTANCE) {
            throw new RuntimeException("Order status is not awaiting confirmation");
        }

        // update order status to be confirmed
        order.setStatus(OrderStatusConstant.ACCEPTED);
        ordersRepository.save(order);

        log.info("Order confirmed: {}", order.getId());
    }

    @Override
    @Transactional
    public void rejection(OrdersOperateDTO ordersRejectionDTO) {
        Orders order = ordersRepository.findById(ordersRejectionDTO.getId())
                .orElseThrow(() -> new RuntimeException("Order not found: " + ordersRejectionDTO.getId()));

        // check order status if it is not awaiting acceptance then throw exception
        if (order.getStatus() != OrderStatusConstant.AWAITING_ACCEPTANCE) {
            throw new RuntimeException("Order status is not awaiting confirmation");
        }

        // update order status to be rejected
        order.setStatus(OrderStatusConstant.CANCELED);
        order.setRejectionReason(ordersRejectionDTO.getReason());
        order.setCancelTime(LocalDateTime.now());
        ordersRepository.save(order);

        log.info("Order rejected: {}, reason: {}", order.getId(), ordersRejectionDTO.getReason());
    }

    @Override
    @Transactional
    public void cancel(OrdersOperateDTO ordersCancelDTO) {
        Orders order = ordersRepository.findById(ordersCancelDTO.getId())
                .orElseThrow(() -> new RuntimeException("Order not found: " + ordersCancelDTO.getId()));

        // check order status if it is not awaiting acceptance or confirmed then throw exception
        if (order.getStatus() != OrderStatusConstant.AWAITING_ACCEPTANCE && order.getStatus() != OrderStatusConstant.ACCEPTED) {
            throw new RuntimeException("Order cannot be cancelled in current status");
        }

        // update order status to be cancelled and set cancel reason
        order.setStatus(OrderStatusConstant.CANCELED);
        order.setCancelReason(ordersCancelDTO.getReason());
        order.setCancelTime(LocalDateTime.now());
        ordersRepository.save(order);

        log.info("Order cancelled: {}, reason: {}", order.getId(), ordersCancelDTO.getReason());
    }

    @Override
    @Transactional
    public void delivery(Long id) {
        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));

        // Check order status if it is not confirmed
        if (order.getStatus() != OrderStatusConstant.ACCEPTED) {
            throw new RuntimeException("Order status is not confirmed");
        }

        // UPDATE ORDER STATUS TO BE DELIVERING
        order.setStatus(4);
        order.setDeliveryTime(LocalDateTime.now());
        ordersRepository.save(order);

        log.info("Order delivered: {}", order.getId());
    }

    @Override
    @Transactional
    public void complete(Long id) {
        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));

        // check order status if it is not delivery then throw exception
        if (order.getStatus() != OrderStatusConstant.DELIVERING) {
            throw new RuntimeException("Order status is not in delivery");
        }

        // update order status to be completed
        order.setStatus(OrderStatusConstant.COMPLETED);
        order.setCheckoutTime(LocalDateTime.now());
        ordersRepository.save(order);

        log.info("Order completed: {}", order.getId());
    }

    @Override
    public Orders findById(Long id) {
        return ordersRepository.findById(id).orElse(null);
    }


    private OrderItemVO convertToOrderDetailVO(OrderDetail orderDetail) {
        OrderItemVO orderItemVO = new OrderItemVO();
        Long menuItemId = orderDetail.getMenuItemId();
        String comboName = comboRepository.findNameById(orderDetail.getComboId());
        List<MenuItemFlavor> flavorList = menuItemFlavorRepository.findByMenuItemId(menuItemId);
        orderItemVO.setName(orderDetail.getName());
        orderItemVO.setImage(orderDetail.getImage());
        orderItemVO.setComboName(comboName);
        orderItemVO.setQuantity(orderDetail.getQuantity());
        orderItemVO.setUnitPrice(orderDetail.getUnitPrice());
        orderItemVO.setTax(orderDetail.getTax());
        orderItemVO.setFlavor(flavorList);

        return orderItemVO;
    }

    @Override
    public WaitingAcceptanceVO getWaitingAcceptanceOrders() {
        try {
            log.info("Finding waiting acceptance orders");

            // find all waiting acceptance orders
            List<Orders> waitingOrders = ordersRepository.findByStatusIn(List.of(OrderStatusConstant.AWAITING_ACCEPTANCE));

            WaitingAcceptanceVO result = new WaitingAcceptanceVO();
            result.setCount(waitingOrders.size());

            // convert to waiting order summary
            List<WaitingAcceptanceVO.WaitingOrderSummary> orderSummaries = waitingOrders.stream()
                    .map(this::convertToWaitingOrderSummary)
                    .collect(Collectors.toList());

            result.setOrders(orderSummaries);

            log.info("Found {} waiting acceptance orders", waitingOrders.size());
            return result;

        } catch (Exception e) {
            log.error("ERROR: Failed to get waiting acceptance orders", e);
            // return empty result if error occurred or no orders found
            WaitingAcceptanceVO emptyResult = new WaitingAcceptanceVO();
            emptyResult.setCount(0);
            emptyResult.setOrders(List.of());
            return emptyResult;
        }
    }

    private WaitingAcceptanceVO.WaitingOrderSummary convertToWaitingOrderSummary(Orders order) {
        WaitingAcceptanceVO.WaitingOrderSummary summary = new WaitingAcceptanceVO.WaitingOrderSummary();
        summary.setId(order.getId());
        summary.setNumber(order.getNumber());
        summary.setUserName(order.getUserName());
        summary.setPhone(order.getPhone());
        summary.setAmount(order.getAmount());
        summary.setOrderTime(order.getOrderTime());

        // calculate waiting minutes
        if (order.getOrderTime() != null) {
            long waitingMinutes = java.time.Duration.between(order.getOrderTime(), LocalDateTime.now()).toMinutes();
            summary.setWaitingMinutes((int) waitingMinutes);
        } else {
            summary.setWaitingMinutes(0);
        }

        return summary;
    }
}