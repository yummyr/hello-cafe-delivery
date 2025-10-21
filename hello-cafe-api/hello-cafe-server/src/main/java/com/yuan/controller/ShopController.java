package com.yuan.controller;

import com.yuan.entity.Shop;
import com.yuan.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class ShopController {

    private final ShopService shopService;

    /**
     * user end：get shop status
     * GET /user/shop/status
     */
    @GetMapping("/user/shop/status")
    public ResponseEntity<Map<String, Object>> getShopStatus() {
        Shop shop = shopService.getShopStatus();

        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("data", shop.getStatus());
        response.put("msg", "success");

        return ResponseEntity.ok(response);
    }

    /**
     * admin api: update shop status
     * POST /api/business/status
     */
    @PostMapping("/api/business/status")
    public ResponseEntity<Map<String, Object>> updateShopStatus(@RequestBody Map<String, Integer> req) {
        Integer status = req.get("status");
        if (status == null || (status != 0 && status != 1)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "code", 400,
                    "msg", "Invalid status value (must be 0 or 1)"
            ));
        }

        Shop updated = shopService.updateShopStatus(status);

        return ResponseEntity.ok(Map.of(
                "code", 200,
                "data", updated.getStatus(),
                "msg", "Shop status updated successfully"
        ));
    }
}
