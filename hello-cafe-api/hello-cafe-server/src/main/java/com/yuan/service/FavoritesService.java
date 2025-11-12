package com.yuan.service;

import java.util.List;
import java.util.Map;

public interface FavoritesService {
    /**
     * 切换收藏状态
     */
    Map<String, Object> toggleFavorite(String itemType, Long itemId, String itemName, String itemImage, Double itemPrice);

    /**
     * 检查收藏状态
     */
    boolean isFavorite(String itemType, Long itemId);

    /**
     * 获取用户收藏列表
     */
    List<Map<String, Object>> getUserFavorites();

    /**
     * 清空用户收藏
     */
    void clearFavorites();
}