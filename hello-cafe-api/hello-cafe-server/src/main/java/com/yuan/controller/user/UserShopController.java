package com.yuan.controller.user;

import com.yuan.result.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/user/shop")
public class UserShopController {

    private final com.yuan.service.ShopService shopService;

    /**
     * Get business status
     */
    @GetMapping("/status")
    public Result<Integer> getStatus() {
        try {
            log.info("Getting shop status");
            Integer status = shopService.getShopStatus();
            return Result.success(status);
        } catch (Exception e) {
            log.error("Failed to get shop status", e);
            return Result.error("Failed to get shop status: " + e.getMessage());
        }
    }
}