package com.yuan.service.impl;

import com.yuan.service.FavoritesService;
import com.yuan.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class FavoritesServiceImpl implements FavoritesService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String FAVORITES_KEY_PREFIX = "favorites:user:";
    private static final long CACHE_TTL = 1800; // 30分钟

    @Override
    public Map<String, Object> toggleFavorite(String itemType, Long itemId, String itemName, String itemImage, Double itemPrice) {
        Long userId = UserUtils.getCurrentUserId();
        String favoritesKey = FAVORITES_KEY_PREFIX + userId;

        try {
            // get current favorites from cache
            List<Map<String, Object>> favorites = getUserFavoritesFromCache(favoritesKey);

            // check if the item is already favorite or not
            Optional<Map<String, Object>> existingFavorite = favorites.stream()
                .filter(fav -> Objects.equals(fav.get("itemType"), itemType) && Objects.equals(fav.get("itemId"), itemId))
                .findFirst();

            boolean isFavorite;
            if (existingFavorite.isPresent()) {
                // if the item is favorite, remove it
                favorites.removeIf(fav -> Objects.equals(fav.get("itemType"), itemType) && Objects.equals(fav.get("itemId"), itemId));
                isFavorite = false;
            } else {
                // if the item is not favorite, add it
                Map<String, Object> favoriteItem = new HashMap<>();
                favoriteItem.put("itemType", itemType);
                favoriteItem.put("itemId", itemId);
                favoriteItem.put("itemName", itemName);
                favoriteItem.put("itemImage", itemImage);
                favoriteItem.put("itemPrice", itemPrice);
                favoriteItem.put("favoritedAt", new Date().toString());

                favorites.add(favoriteItem);
                isFavorite = true;
            }

            // update favorites in cache
            redisTemplate.opsForValue().set(favoritesKey, favorites, CACHE_TTL, TimeUnit.MINUTES);

            return Map.of(
                "isFavorite", isFavorite,
                "message", isFavorite ? "Item added to favorites" : "Item removed from favorites"
            );

        } catch (Exception e) {
            throw new RuntimeException("Failed to toggle favorite: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean isFavorite(String itemType, Long itemId) {
        Long userId = UserUtils.getCurrentUserId();
        String favoritesKey = FAVORITES_KEY_PREFIX + userId;

        try {
            List<Map<String, Object>> favorites = getUserFavoritesFromCache(favoritesKey);
            return favorites.stream()
                .anyMatch(fav -> Objects.equals(fav.get("itemType"), itemType) && Objects.equals(fav.get("itemId"), itemId));
        } catch (Exception e) {
            throw new RuntimeException("Failed to check favorite status: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Map<String, Object>> getUserFavorites() {
        Long userId = UserUtils.getCurrentUserId();
        String favoritesKey = FAVORITES_KEY_PREFIX + userId;
        return getUserFavoritesFromCache(favoritesKey);
    }

    @Override
    public void clearFavorites() {
        Long userId = UserUtils.getCurrentUserId();
        String favoritesKey = FAVORITES_KEY_PREFIX + userId;
        redisTemplate.delete(favoritesKey);
    }


    private List<Map<String, Object>> getUserFavoritesFromCache(String favoritesKey) {
        List<Map<String, Object>> favorites = (List<Map<String, Object>>) redisTemplate.opsForValue().get(favoritesKey);
        if (favorites == null) {
            favorites = new ArrayList<>();
        }
        return favorites;
    }}