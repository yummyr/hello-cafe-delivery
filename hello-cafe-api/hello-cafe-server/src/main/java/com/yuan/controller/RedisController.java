package com.yuan.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/redis")
public class RedisController {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * 获取Redis缓存
     */
    @GetMapping("/get")
    public ResponseEntity<?> getValue(@RequestParam String key) {
        try {
            Object value = redisTemplate.opsForValue().get(key);
            return ResponseEntity.ok(Map.of(
                "code", 1,
                "data", value != null ? value : ""
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "code", 0,
                "message", "Failed to get value: " + e.getMessage()
            ));
        }
    }

    /**
     * 设置Redis缓存
     */
    @PostMapping("/set")
    public ResponseEntity<?> setValue(@RequestBody Map<String, Object> request) {
        try {
            String key = (String) request.get("key");
            Object value = request.get("value");
            Integer ttl = (Integer) request.getOrDefault("ttl", 3600);

            if (key == null || value == null) {
                return ResponseEntity.ok(Map.of(
                    "code", 0,
                    "message", "Key and value are required"
                ));
            }

            redisTemplate.opsForValue().set(key, value, ttl, TimeUnit.SECONDS);
            return ResponseEntity.ok(Map.of(
                "code", 1,
                "message", "Value set successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "code", 0,
                "message", "Failed to set value: " + e.getMessage()
            ));
        }
    }

    /**
     * 删除Redis缓存
     */
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteValue(@RequestParam String key) {
        try {
            Boolean deleted = redisTemplate.delete(key);
            return ResponseEntity.ok(Map.of(
                "code", 1,
                "data", deleted
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "code", 0,
                "message", "Failed to delete value: " + e.getMessage()
            ));
        }
    }

    /**
     * 检查Redis缓存是否存在
     */
    @GetMapping("/exists")
    public ResponseEntity<?> exists(@RequestParam String key) {
        try {
            Boolean exists = redisTemplate.hasKey(key);
            return ResponseEntity.ok(Map.of(
                "code", 1,
                "data", exists
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "code", 0,
                "message", "Failed to check existence: " + e.getMessage()
            ));
        }
    }

    /**
     * 清空所有缓存
     */
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearAll() {
        try {
            redisTemplate.getConnectionFactory().getConnection().flushDb();
            return ResponseEntity.ok(Map.of(
                "code", 1,
                "message", "All cache cleared successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "code", 0,
                "message", "Failed to clear cache: " + e.getMessage()
            ));
        }
    }
}