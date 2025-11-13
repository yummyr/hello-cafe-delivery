package com.yuan.service;

import java.util.List;
import java.util.Map;

public interface FavoritesService {
    /**
     * Toggle favorite status
     */
    Map<String, Object> toggleFavorite(String itemType, Long itemId, String itemName, String itemImage, Double itemPrice);

    /**
     * Check favorite status
     */
    boolean isFavorite(String itemType, Long itemId);

    /**
     * Get user favorites list
     */
    List<Map<String, Object>> getUserFavorites();

    /**
     * Clear user favorites
     */
    void clearFavorites();
}