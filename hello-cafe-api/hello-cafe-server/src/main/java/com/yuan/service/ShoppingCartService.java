package com.yuan.service;

import com.yuan.dto.ShoppingCartDTO;
import com.yuan.vo.ShoppingCartVO;

import java.util.List;

public interface ShoppingCartService {
    /**
     * 添加购物车
     */
    void addToCart(ShoppingCartDTO shoppingCartDTO);

    /**
     * 查看购物车
     */
    List<ShoppingCartVO> listCart();

    /**
     * 删除购物车中一个商品
     */
    void subtractFromCart(ShoppingCartDTO shoppingCartDTO);

    /**
     * 清空购物车
     */
    void cleanCart();
}