package com.yuan.controller.user;

import com.yuan.result.Result;
import com.yuan.service.user.ShopService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/user/shop")
public class UserShopController {

    private final ShopService shopService;

    /**
     * 获取营业状态
     */
    @GetMapping("/status")
    public Result<Integer> getStatus() {
        try {
            log.info("Getting shop status");
            Integer status = shopService.getStatus();
            return Result.success(status);
        } catch (Exception e) {
            log.error("Failed to get shop status", e);
            return Result.error("Failed to get shop status: " + e.getMessage());
        }
    }
}