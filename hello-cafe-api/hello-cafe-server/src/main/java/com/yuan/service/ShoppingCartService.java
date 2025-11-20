package com.yuan.service;

import com.yuan.dto.ShoppingCartDTO;
import com.yuan.vo.ShoppingCartVO;

import java.util.List;

public interface ShoppingCartService {
    /**
     * Add to shopping cart
     */
    void addToCart(ShoppingCartDTO shoppingCartDTO);

    /**
     * View shopping cart
     */
    List<ShoppingCartVO> listCart();

    /**
     * Remove one item from shopping cart
     */
    void subtractFromCart(ShoppingCartDTO shoppingCartDTO);

    /**
     * Clear shopping cart
     */
    void cleanCart();

    /**
     * Clear shopping cart cache only (without deleting database records)
     */
    void clearCartCache();
}