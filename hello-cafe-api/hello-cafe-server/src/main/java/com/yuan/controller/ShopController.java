package com.yuan.controller;


import com.yuan.result.Result;
import com.yuan.service.ShopService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/shop/status")
@Slf4j
public class ShopController {

    private final ShopService shopService;

    @GetMapping
    public Result getShopStatus() {
        Integer status = shopService.getShopStatus();
        return Result.success(status);
    }

    @PutMapping
    public Result updateShopStatus(@RequestBody Map<String, Integer> req) {
        try {
            Integer status = req.get("status");
            if (status == null || (status != 0 && status != 1)) {
                return Result.error("Invalid status value (must be 0 or 1)");
            }

            shopService.updateShopStatus(status);

            return Result.success(status);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
