package com.yuan.controller.user;

import com.yuan.service.FavoritesService;
import com.yuan.result.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/favorites")
public class UserFavoritesController {

    @Autowired
    private FavoritesService favoritesService;

    /**
     * toggle favorite item
     */
    @PostMapping("/toggle")
    public Result<Map<String, Object>> toggleFavorite(@RequestBody Map<String, Object> request) {
        try {
            String itemType = (String) request.get("itemType");
            Long itemId = Long.valueOf(request.get("itemId").toString());
            String itemName = (String) request.get("itemName");
            String itemImage = (String) request.get("itemImage");
            Double itemPrice = request.get("itemPrice") != null ?
                Double.valueOf(request.get("itemPrice").toString()) : null;

            Map<String, Object> result = favoritesService.toggleFavorite(itemType, itemId, itemName, itemImage, itemPrice);
            return Result.success(result);
        } catch (Exception e) {
            return Result.error("Failed to toggle favorite: " + e.getMessage());
        }
    }

    /**
     * 检查收藏状态
     */
    @GetMapping("/status")
    public Result<Map<String, Object>> checkFavoriteStatus(
            @RequestParam String itemType,
            @RequestParam Long itemId) {
        try {
            boolean isFavorite = favoritesService.isFavorite(itemType, itemId);
            return Result.success(Map.of("isFavorite", isFavorite));
        } catch (Exception e) {
            return Result.error("Failed to check favorite status: " + e.getMessage());
        }
    }

    /**
     * 获取用户收藏列表
     */
    @GetMapping("/list")
    public Result<List<Map<String, Object>>> getUserFavorites() {
        try {
            List<Map<String, Object>> favorites = favoritesService.getUserFavorites();
            return Result.success(favorites);
        } catch (Exception e) {
            return Result.error("Failed to get user favorites: " + e.getMessage());
        }
    }

    /**
     * 清空用户收藏
     */
    @DeleteMapping("/clear")
    public Result<String> clearFavorites() {
        try {
            favoritesService.clearFavorites();
            return Result.success("Favorites cleared successfully");
        } catch (Exception e) {
            return Result.error("Failed to clear favorites: " + e.getMessage());
        }
    }
}