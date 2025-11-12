package com.yuan.service.user.impl;

import com.yuan.dto.OrdersPaymentDTO;
import com.yuan.dto.OrdersSubmitDTO;
import com.yuan.entity.*;
import com.yuan.repository.*;
import com.yuan.result.PageResult;
import com.yuan.service.StripeService;
import com.yuan.service.user.OrderService;
import com.yuan.vo.OrderPaymentVO;
import com.yuan.vo.OrderSubmitVO;
import com.yuan.vo.OrderVO;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service("userOrderServiceImpl")
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrdersRepository ordersRepository;
    private final ShoppingCartRepository shoppingCartRepository;
    private final AddressBookRepository addressBookRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final MenuItemRepository menuItemRepository;
    private final ComboRepository comboRepository;
    private final StripeService stripeService;

    // TODO: Get current user ID from security context
    private Long getCurrentUserId() {
        // This should be implemented to get the current logged-in user ID
        return 1L;
    }

    @Override
    @Transactional
    public OrderSubmitVO submitOrder(OrdersSubmitDTO ordersSubmitDTO) {
        log.info("Submitting order for user: {}", getCurrentUserId());

        // 1. 验证地址簿
        AddressBook addressBook = addressBookRepository.findById(ordersSubmitDTO.getAddressBookId())
                .orElseThrow(() -> new RuntimeException("Address book not found"));

        if (!addressBook.getUserId().equals(getCurrentUserId())) {
            throw new RuntimeException("Unauthorized address book");
        }

        // 2. 获取购物车商品
        List<ShoppingCart> cartItems = shoppingCartRepository.findByUserId(getCurrentUserId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Shopping cart is empty");
        }

        // 3. 创建订单
        Orders order = new Orders();
        order.setNumber(generateOrderNumber());
        order.setUserId(getCurrentUserId());
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
        shoppingCartRepository.deleteByUserId(getCurrentUserId());

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

        if (!order.getUserId().equals(getCurrentUserId())) {
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
        // orderVO.setUserId(order.getUserId());
        // orderVO.setAddressBookId(order.getAddressBookId());
        orderVO.setOrderTime(order.getOrderTime());
        // orderVO.setCheckoutTime(order.getCheckoutTime());
        // orderVO.setPayMethod(order.getPayMethod());
        // orderVO.setPayStatus(order.getPayStatus());
        orderVO.setAmount(order.getAmount());
        // orderVO.setRemark(order.getNotes());
        orderVO.setPhone(order.getPhone());
        // orderVO.setAddress(order.getAddress());
        // orderVO.setConsignee(order.getName());
        // orderVO.setCancelReason(order.getCancelReason());
        // orderVO.setRejectionReason(order.getRejectionReason());
        // orderVO.setCancelTime(order.getCancelTime());
        // orderVO.setEstimatedDeliveryTime(order.getEstimatedDeliveryTime());
        // orderVO.setDeliveryStatus(order.getDeliveryStatus());
        // orderVO.setDeliveryTime(order.getDeliveryTime());
        // orderVO.setPackAmount(order.getPackAmount());
        // orderVO.setTablewareNumber(order.getTablewareNumber());
        // orderVO.setTablewareStatus(order.getTablewareStatus());

        return orderVO;
    }

    @Override
    public PageResult historyOrders(Integer page, Integer pageSize, Integer status) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);

        Page<Orders> orderPage;
        if (status != null) {
            orderPage = ordersRepository.findByUserIdAndStatus(getCurrentUserId(), status, pageable);
        } else {
            orderPage = ordersRepository.findByUserId(getCurrentUserId(), pageable);
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

        if (!order.getUserId().equals(getCurrentUserId())) {
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

        if (!order.getUserId().equals(getCurrentUserId())) {
            throw new RuntimeException("Unauthorized to repeat this order");
        }

        // 实现再来一单逻辑 - 将原订单的商品重新添加到购物车
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(id);

        for (OrderDetail detail : orderDetails) {
            ShoppingCart cartItem = new ShoppingCart();
            cartItem.setUserId(getCurrentUserId());

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

        if (!order.getUserId().equals(getCurrentUserId())) {
            throw new RuntimeException("Unauthorized to remind this order");
        }

        // 实现催单逻辑 - 这里可以扩展为发送通知给商家
        // 记录催单时间（可以添加新的字段来追踪催单次数和时间）
        // Note: Orders entity doesn't have updateTime field
        ordersRepository.save(order);

        log.info("Order reminder sent: {}", id);
    }

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
        // orderVO.setUserId(order.getUserId());
        // orderVO.setAddressBookId(order.getAddressBookId());
        orderVO.setOrderTime(order.getOrderTime());
        // orderVO.setCheckoutTime(order.getCheckoutTime());
        // orderVO.setPayMethod(order.getPayMethod());
        // orderVO.setPayStatus(order.getPayStatus());
        orderVO.setAmount(order.getAmount());
        // orderVO.setRemark(order.getNotes());
        orderVO.setPhone(order.getPhone());
        // orderVO.setAddress(order.getAddress());
        // orderVO.setConsignee(order.getName());
        // orderVO.setCancelReason(order.getCancelReason());
        // orderVO.setRejectionReason(order.getRejectionReason());
        // orderVO.setCancelTime(order.getCancelTime());
        // orderVO.setEstimatedDeliveryTime(order.getEstimatedDeliveryTime());
        // orderVO.setDeliveryStatus(order.getDeliveryStatus());
        // orderVO.setDeliveryTime(order.getDeliveryTime());
        // orderVO.setPackAmount(order.getPackAmount());
        // orderVO.setTablewareNumber(order.getTablewareNumber());
        // orderVO.setTablewareStatus(order.getTablewareStatus());

        return orderVO;
    }
}