package com.yuan.service.impl;

import com.yuan.dto.ShoppingCartDTO;
import com.yuan.entity.Combo;
import com.yuan.entity.MenuItem;
import com.yuan.entity.ShoppingCart;
import com.yuan.repository.ComboRepository;
import com.yuan.repository.MenuItemRepository;
import com.yuan.repository.ShoppingCartRepository;
import com.yuan.service.ShoppingCartService;
import com.yuan.utils.UserUtils;
import com.yuan.vo.ShoppingCartVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShoppingCartServiceImpl implements ShoppingCartService {

    private final ShoppingCartRepository shoppingCartRepository;
    private final MenuItemRepository menuItemRepository;
    private final ComboRepository comboRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    


    // Redis key prefix for cart items cache
    private String getCartCacheKey(Long userId) {
        return "cart:user:" + userId;
    }

    @SuppressWarnings("unchecked")
    private List<ShoppingCartVO> getCartFromCache(Long userId) {
        try {
            String cacheKey = getCartCacheKey(userId);
            Object cachedData = redisTemplate.opsForValue().get(cacheKey);
            if (cachedData instanceof List) {
                return (List<ShoppingCartVO>) cachedData;
            }
        } catch (Exception e) {
            log.error("Failed to get cart from cache for user {}", userId, e);
        }
        return null;
    }

    private void setCartToCache(Long userId, List<ShoppingCartVO> cartItems) {
        try {
            String cacheKey = getCartCacheKey(userId);
            // 缓存30分钟
            redisTemplate.opsForValue().set(cacheKey, cartItems, 30, TimeUnit.MINUTES);
        } catch (Exception e) {
            log.error("Failed to set cart to cache for user {}", userId, e);
        }
    }

    private void clearCartCache(Long userId) {
        try {
            String cacheKey = getCartCacheKey(userId);
            redisTemplate.delete(cacheKey);
        } catch (Exception e) {
            log.error("Failed to clear cart cache for user {}", userId, e);
        }
    }

    @Override
    @Transactional
    public void addToCart(ShoppingCartDTO shoppingCartDTO) {
        log.info("Adding to cart: menuItemId={}, comboId={}, flavor={}", shoppingCartDTO.getMenuItemId(), shoppingCartDTO.getComboId(), shoppingCartDTO.getFlavor());

        ShoppingCart shoppingCart = new ShoppingCart();

        if (shoppingCartDTO.getMenuItemId() != null) {
            // handle menu item case
            MenuItem menuItem = menuItemRepository.findById(shoppingCartDTO.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Dish not found"));

            shoppingCart.setName(menuItem.getName());
            shoppingCart.setImage(menuItem.getImage());
            shoppingCart.setMenuItemId(shoppingCartDTO.getMenuItemId());
            shoppingCart.setUnitPrice(menuItem.getPrice());
        } else if (shoppingCartDTO.getComboId() != null) {
            // handle combo case
            Combo combo = comboRepository.findById(shoppingCartDTO.getComboId())
                    .orElseThrow(() -> new RuntimeException("Combo not found"));

            shoppingCart.setName(combo.getName());
            shoppingCart.setImage(combo.getImage());
            shoppingCart.setComboId(shoppingCartDTO.getComboId());
            shoppingCart.setUnitPrice(combo.getPrice());
        } else {
            throw new RuntimeException("Either dishId or setmealId must be provided");
        }

        shoppingCart.setUserId(UserUtils.getCurrentUserId());
        shoppingCart.setFlavor(shoppingCartDTO.getFlavor());
        shoppingCart.setQuantity(1); // default quantity is 1
        shoppingCart.setCreateTime(LocalDateTime.now());

        // check if item already exists
        ShoppingCart existingCart = null;
        if (shoppingCartDTO.getMenuItemId() != null) {
            existingCart = shoppingCartRepository.findByUserIdAndMenuItemIdAndFlavor(
                    UserUtils.getCurrentUserId(), shoppingCartDTO.getMenuItemId(), shoppingCartDTO.getFlavor());
        } else if (shoppingCartDTO.getComboId() != null) {
            existingCart = shoppingCartRepository.findByUserIdAndComboId(
                    UserUtils.getCurrentUserId(), shoppingCartDTO.getComboId());
        }

        if (existingCart != null) {
            // if exists, increase quantity
            existingCart.setQuantity(existingCart.getQuantity() + 1);
            shoppingCartRepository.save(existingCart);
        } else {
            // if not exists, add to cart
            shoppingCartRepository.save(shoppingCart);
        }

        log.info("Successfully added to cart");

        // clear cart cache after successful addition, as it may have changed
        clearCartCache(UserUtils.getCurrentUserId());
    }

    @Override
    public List<ShoppingCartVO> listCart() {
        Long userId = UserUtils.getCurrentUserId();

        // try to get cart from cache first
        List<ShoppingCartVO> cachedCart = getCartFromCache(userId);
        if (cachedCart != null) {
            log.info("Retrieved cart from cache for user {}", userId);
            return cachedCart;
        }

        // if not found in cache, retrieve from database
        List<ShoppingCart> cartItems = shoppingCartRepository.findByUserId(userId);
        List<ShoppingCartVO> cartVOs = cartItems.stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());

        // set cart to cache and return results
        setCartToCache(userId, cartVOs);
        log.info("Retrieved cart from database and cached for user {}", userId);

        return cartVOs;
    }

    /**
     * Convert ShoppingCart to ShoppingCartVO for public
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
        log.info("Subtracting from cart: dishId={}, setmealId={}, flavor={}", shoppingCartDTO.getMenuItemId(), shoppingCartDTO.getComboId(), shoppingCartDTO.getFlavor());

        ShoppingCart existingCart = null;
        if (shoppingCartDTO.getMenuItemId() != null) {
            existingCart = shoppingCartRepository.findByUserIdAndMenuItemIdAndFlavor(
                    UserUtils.getCurrentUserId(), shoppingCartDTO.getMenuItemId(), shoppingCartDTO.getFlavor());
        } else if (shoppingCartDTO.getComboId() != null) {
            existingCart = shoppingCartRepository.findByUserIdAndComboId(
                    UserUtils.getCurrentUserId(), shoppingCartDTO.getComboId());
        }

        if (existingCart == null) {
            throw new RuntimeException("Item not found in cart");
        }

        if (existingCart.getQuantity() > 1) {
            // if quantity is greater than 1, decrease quantity
            existingCart.setQuantity(existingCart.getQuantity() - 1);
            shoppingCartRepository.save(existingCart);
        } else {
            // if quantity is 1, delete item
            shoppingCartRepository.delete(existingCart);
        }

        log.info("Successfully subtracted from cart");

        // clear cart cache after successful addition, as it may have changed for public
        clearCartCache(UserUtils.getCurrentUserId());
    }

    @Override
    @Transactional
    public void cleanCart() {
        log.info("Cleaning cart for user: {}", UserUtils.getCurrentUserId());
        shoppingCartRepository.deleteByUserId(UserUtils.getCurrentUserId());

        // clear cart cache after successful addition, as it may have changed for public
        clearCartCache(UserUtils.getCurrentUserId());
    }
}