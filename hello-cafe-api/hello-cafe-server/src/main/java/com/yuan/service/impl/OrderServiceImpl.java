package com.yuan.service.impl;

import com.yuan.constant.OrderStatusConstant;
import com.yuan.dto.*;
import com.yuan.entity.*;
import com.yuan.repository.*;
import com.yuan.result.PageResult;
import com.yuan.service.OrderService;
import com.yuan.service.StripeService;
import com.yuan.utils.UserUtils;
import com.yuan.vo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.stripe.exception.StripeException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrdersRepository ordersRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ComboRepository comboRepository;
    private final MenuItemFlavorRepository menuItemFlavorRepository;
    private final ShoppingCartRepository shoppingCartRepository;
    private final AddressBookRepository addressBookRepository;
    private final MenuItemRepository menuItemRepository;
    private final StripeService stripeService;



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

    // ========== User Order Methods ==========

    @Override
    @Transactional
    public OrderSubmitVO submitOrder(OrdersSubmitDTO ordersSubmitDTO) {
        log.info("Submitting order for user: {}", UserUtils.getCurrentUserId());

        Long currentUserId = UserUtils.getCurrentUserId();

        // 1. 验证地址簿
        AddressBook addressBook = addressBookRepository.findById(ordersSubmitDTO.getAddressBookId())
                .orElseThrow(() -> new RuntimeException("Address book not found"));

        if (!addressBook.getUserId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized address book");
        }

        // 2. 获取购物车商品
        List<ShoppingCart> cartItems = shoppingCartRepository.findByUserId(currentUserId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Shopping cart is empty");
        }

        // 3. 创建订单
        Orders order = new Orders();
        order.setNumber(generateOrderNumber());
        order.setUserId(currentUserId);
        order.setAddressBookId(ordersSubmitDTO.getAddressBookId());
        order.setOrderTime(LocalDateTime.now());
        order.setAmount(ordersSubmitDTO.getAmount());
        order.setPayMethod(ordersSubmitDTO.getPayMethod());
        order.setPayStatus(0); // 未支付
        order.setStatus(1); // 待付款
        order.setNotes(ordersSubmitDTO.getRemark());
        order.setPhone(addressBook.getPhone());
        order.setDeliveryStatus(ordersSubmitDTO.getDeliveryStatus());
        order.setEstimatedDeliveryTime(LocalDateTime.parse(ordersSubmitDTO.getEstimatedDeliveryTime()));
        order.setPackAmount(ordersSubmitDTO.getPackAmount());
        order.setTablewareNumber(ordersSubmitDTO.getTablewareNumber());
        order.setTablewareStatus(ordersSubmitDTO.getTablewareStatus());

        // 4. 保存订单
        Orders savedOrder = ordersRepository.save(order);

        // 5. 创建订单详情
        saveOrderDetails(savedOrder.getId(), cartItems);

        // 6. 清空购物车
        shoppingCartRepository.deleteByUserId(currentUserId);

        OrderSubmitVO orderSubmitVO = new OrderSubmitVO();
        orderSubmitVO.setId(savedOrder.getId());
        orderSubmitVO.setOrderNumber(savedOrder.getNumber());
        orderSubmitVO.setOrderAmount(savedOrder.getAmount());
        orderSubmitVO.setOrderTime(savedOrder.getOrderTime());

        log.info("Order submitted successfully: {}", orderSubmitVO.getOrderNumber());
        return orderSubmitVO;
    }

    @Override
    public OrderPaymentVO payment(OrdersPaymentDTO ordersPaymentDTO) throws StripeException {
        log.info("Processing payment for order: {}", ordersPaymentDTO.getOrderNumber());

        // 查找订单
        Orders order = ordersRepository.findByNumber(ordersPaymentDTO.getOrderNumber());
        if (order == null) {
            throw new RuntimeException("Order not found");
        }

        if (order.getPayStatus() == 1) {
            throw new RuntimeException("Order already paid");
        }

        // 创建Stripe支付会话
        String paymentUrl = stripeService.createPaymentSession(
                order.getId(),
                BigDecimal.valueOf(order.getAmount()),
                order.getNumber()
        );

        OrderPaymentVO orderPaymentVO = new OrderPaymentVO();
        orderPaymentVO.setNonceStr("stripe_" + System.currentTimeMillis());
        orderPaymentVO.setPackageStr(paymentUrl); // 返回Stripe支付URL
        orderPaymentVO.setSignType("STRIPE");
        orderPaymentVO.setTimeStamp(String.valueOf(System.currentTimeMillis() / 1000));
        orderPaymentVO.setPaySign(order.getNumber());

        log.info("Stripe payment session created for order: {}, payment URL: {}",
                ordersPaymentDTO.getOrderNumber(), paymentUrl);

        return orderPaymentVO;
    }

    @Override
    public OrderVO getOrderDetail(Long id) {
        Orders order = ordersRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        Long currentUserId = UserUtils.getCurrentUserId();

        if (!order.getUserId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized to view this order");
        }

        // 查询订单详情项
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(id);

        // 转换订单详情项（这里可以扩展为更详细的VO）
        // orderVO.setOrderItems(convertToOrderItemVOs(orderDetails));

        OrderVO orderVO = new OrderVO();
        orderVO.setId(order.getId());
        orderVO.setNumber(order.getNumber());
        orderVO.setStatus(order.getStatus());
        orderVO.setOrderTime(order.getOrderTime());
        orderVO.setAmount(order.getAmount());
        orderVO.setPhone(order.getPhone());

        return orderVO;
    }

    @Override
    public PageResult historyOrders(Integer page, Integer pageSize, Integer status) {
        Long currentUserId = UserUtils.getCurrentUserId();
        Pageable pageable = PageRequest.of(page - 1, pageSize);

        Page<Orders> orderPage;
        if (status != null) {
            orderPage = ordersRepository.findByUserIdAndStatus(currentUserId, status, pageable);
        } else {
            orderPage = ordersRepository.findByUserId(currentUserId, pageable);
        }

        // 转换为OrderVO列表
        List<OrderVO> orderVOList = orderPage.getContent().stream()
                .map(this::convertToOrderVO)
                .collect(Collectors.toList());

        return new PageResult(orderPage.getTotalElements(), orderVOList);
    }

    @Override
    @Transactional
    public void cancelOrder(Long id) {
        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Long currentUserId = UserUtils.getCurrentUserId();

        if (!order.getUserId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized to cancel this order");
        }

        // 检查订单状态，只有待付款的订单可以取消
        if (order.getStatus() != 1) {
            throw new RuntimeException("Order cannot be cancelled in current status");
        }

        order.setStatus(6); // 已取消
        order.setCancelTime(LocalDateTime.now());
        ordersRepository.save(order);

        log.info("Order cancelled: {}", id);
    }

    @Override
    public void repetitionOrder(Long id) {
        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Long currentUserId = UserUtils.getCurrentUserId();

        if (!order.getUserId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized to repeat this order");
        }

        // 实现再来一单逻辑 - 将原订单的商品重新添加到购物车
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(id);

        for (OrderDetail detail : orderDetails) {
            ShoppingCart cartItem = new ShoppingCart();
            cartItem.setUserId(currentUserId);

            if (detail.getMenuItemId() != null) {
                cartItem.setMenuItemId(detail.getMenuItemId());
            } else if (detail.getComboId() != null) {
                cartItem.setComboId(detail.getComboId());
            }

            cartItem.setQuantity(detail.getQuantity());
            cartItem.setCreateTime(LocalDateTime.now());
            cartItem.setUpdateTime(LocalDateTime.now());

            shoppingCartRepository.save(cartItem);
        }

        log.info("Repeating order: {}", id);
    }

    @Override
    public void reminderOrder(Long id) {
        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Long currentUserId = UserUtils.getCurrentUserId();

        if (!order.getUserId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized to remind this order");
        }

        // 实现催单逻辑 - 这里可以扩展为发送通知给商家
        // 记录催单时间（可以添加新的字段来追踪催单次数和时间）
        // Note: Orders entity doesn't have updateTime field
        ordersRepository.save(order);

        log.info("Order reminder sent: {}", id);
    }

    // ========== Helper Methods ==========

    private String generateOrderNumber() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        return "ORD" + formatter.format(LocalDateTime.now()) + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    /**
     * 保存订单详情
     */
    private void saveOrderDetails(Long orderId, List<ShoppingCart> cartItems) {
        for (ShoppingCart cartItem : cartItems) {
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrderId(orderId);

            if (cartItem.getMenuItemId() != null) {
                // 菜品
                MenuItem menuItem = menuItemRepository.findById(cartItem.getMenuItemId())
                        .orElseThrow(() -> new RuntimeException("Menu item not found: " + cartItem.getMenuItemId()));

                orderDetail.setMenuItemId(cartItem.getMenuItemId());
                orderDetail.setName(menuItem.getName());
                orderDetail.setImage(menuItem.getImage());
                orderDetail.setUnitPrice(menuItem.getPrice());
            } else if (cartItem.getComboId() != null) {
                // 套餐
                Combo combo = comboRepository.findById(cartItem.getComboId())
                        .orElseThrow(() -> new RuntimeException("Combo not found: " + cartItem.getComboId()));

                orderDetail.setComboId(cartItem.getComboId());
                orderDetail.setName(combo.getName());
                orderDetail.setImage(combo.getImage());
                orderDetail.setUnitPrice(combo.getPrice());
            }

            orderDetail.setQuantity(cartItem.getQuantity());
            orderDetail.setTax(0.0); // 可以根据需要计算税费

            orderDetailRepository.save(orderDetail);
        }
    }

    /**
     * 转换订单为VO
     */
    private OrderVO convertToOrderVO(Orders order) {
        OrderVO orderVO = new OrderVO();
        orderVO.setId(order.getId());
        orderVO.setNumber(order.getNumber());
        orderVO.setStatus(order.getStatus());
        orderVO.setOrderTime(order.getOrderTime());
        orderVO.setAmount(order.getAmount());
        orderVO.setPhone(order.getPhone());

        return orderVO;
    }
}