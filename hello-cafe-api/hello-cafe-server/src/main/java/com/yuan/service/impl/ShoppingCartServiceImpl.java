package com.yuan.service.impl;

import com.yuan.dto.ShoppingCartDTO;
import com.yuan.entity.Combo;
import com.yuan.entity.MenuItem;
import com.yuan.entity.ShoppingCart;
import com.yuan.repository.ComboRepository;
import com.yuan.repository.MenuItemRepository;
import com.yuan.repository.ShoppingCartRepository;
import com.yuan.service.ShoppingCartService;
import com.yuan.vo.ShoppingCartVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShoppingCartServiceImpl implements ShoppingCartService {

    private final ShoppingCartRepository shoppingCartRepository;
    private final MenuItemRepository menuItemRepository;
    private final ComboRepository comboRepository;

    // TODO: Get current user ID from security context
    private Long getCurrentUserId() {
        // This should be implemented to get the current logged-in user ID
        // For now, return a placeholder
        return 1L;
    }

    @Override
    @Transactional
    public void addToCart(ShoppingCartDTO shoppingCartDTO) {
        log.info("Adding to cart: dishId={}, setmealId={}, flavor={}", shoppingCartDTO.getDishId(), shoppingCartDTO.getSetmealId(), shoppingCartDTO.getFlavor());

        ShoppingCart shoppingCart = new ShoppingCart();

        if (shoppingCartDTO.getDishId() != null) {
            // 处理菜品
            MenuItem menuItem = menuItemRepository.findById(shoppingCartDTO.getDishId())
                    .orElseThrow(() -> new RuntimeException("Dish not found"));

            shoppingCart.setName(menuItem.getName());
            shoppingCart.setImage(menuItem.getImage());
            shoppingCart.setMenuItemId(shoppingCartDTO.getDishId());
            shoppingCart.setUnitPrice(menuItem.getPrice());
        } else if (shoppingCartDTO.getSetmealId() != null) {
            // 处理套餐
            Combo combo = comboRepository.findById(shoppingCartDTO.getSetmealId())
                    .orElseThrow(() -> new RuntimeException("Combo not found"));

            shoppingCart.setName(combo.getName());
            shoppingCart.setImage(combo.getImage());
            shoppingCart.setComboId(shoppingCartDTO.getSetmealId());
            shoppingCart.setUnitPrice(combo.getPrice());
        } else {
            throw new RuntimeException("Either dishId or setmealId must be provided");
        }

        shoppingCart.setUserId(getCurrentUserId());
        shoppingCart.setFlavor(shoppingCartDTO.getFlavor());
        shoppingCart.setQuantity(1); // 默认数量为1
        shoppingCart.setCreateTime(LocalDateTime.now());

        // 检查购物车中是否已存在相同商品
        ShoppingCart existingCart = null;
        if (shoppingCartDTO.getDishId() != null) {
            existingCart = shoppingCartRepository.findByUserIdAndMenuItemIdAndFlavor(
                    getCurrentUserId(), shoppingCartDTO.getDishId(), shoppingCartDTO.getFlavor());
        } else if (shoppingCartDTO.getSetmealId() != null) {
            existingCart = shoppingCartRepository.findByUserIdAndComboId(
                    getCurrentUserId(), shoppingCartDTO.getSetmealId());
        }

        if (existingCart != null) {
            // 如果已存在，增加数量
            existingCart.setQuantity(existingCart.getQuantity() + 1);
            shoppingCartRepository.save(existingCart);
        } else {
            // 如果不存在，新增
            shoppingCartRepository.save(shoppingCart);
        }

        log.info("Successfully added to cart");
    }

    @Override
    public List<ShoppingCartVO> listCart() {
        List<ShoppingCart> cartItems = shoppingCartRepository.findByUserId(getCurrentUserId());
        return cartItems.stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());
    }

    /**
     * 转换购物车实体为VO
     */
    private ShoppingCartVO convertToVO(ShoppingCart cart) {
        ShoppingCartVO vo = new ShoppingCartVO();
        vo.setId(cart.getId());
        vo.setName(cart.getName());
        vo.setImage(cart.getImage());
        vo.setUserId(cart.getUserId());
        vo.setMenuItemId(cart.getMenuItemId());
        vo.setComboId(cart.getComboId());
        vo.setQuantity(cart.getQuantity());
        vo.setUnitPrice(cart.getUnitPrice() != null ? BigDecimal.valueOf(cart.getUnitPrice()) : BigDecimal.ZERO);
        vo.setFlavor(cart.getFlavor());
        vo.setCreateTime(cart.getCreateTime());
        return vo;
    }

    @Override
    @Transactional
    public void subtractFromCart(ShoppingCartDTO shoppingCartDTO) {
        log.info("Subtracting from cart: dishId={}, setmealId={}, flavor={}", shoppingCartDTO.getDishId(), shoppingCartDTO.getSetmealId(), shoppingCartDTO.getFlavor());

        ShoppingCart existingCart = null;
        if (shoppingCartDTO.getDishId() != null) {
            existingCart = shoppingCartRepository.findByUserIdAndMenuItemIdAndFlavor(
                    getCurrentUserId(), shoppingCartDTO.getDishId(), shoppingCartDTO.getFlavor());
        } else if (shoppingCartDTO.getSetmealId() != null) {
            existingCart = shoppingCartRepository.findByUserIdAndComboId(
                    getCurrentUserId(), shoppingCartDTO.getSetmealId());
        }

        if (existingCart == null) {
            throw new RuntimeException("Item not found in cart");
        }

        if (existingCart.getQuantity() > 1) {
            // 如果数量大于1，减少数量
            existingCart.setQuantity(existingCart.getQuantity() - 1);
            shoppingCartRepository.save(existingCart);
        } else {
            // 如果数量为1，删除该记录
            shoppingCartRepository.delete(existingCart);
        }

        log.info("Successfully subtracted from cart");
    }

    @Override
    @Transactional
    public void cleanCart() {
        log.info("Cleaning cart for user: {}", getCurrentUserId());
        shoppingCartRepository.deleteByUserId(getCurrentUserId());
    }
}