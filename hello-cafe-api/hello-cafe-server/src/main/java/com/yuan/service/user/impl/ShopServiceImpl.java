package com.yuan.service.user.impl;

import com.yuan.entity.Shop;
import com.yuan.repository.ShopRepository;
import com.yuan.service.user.ShopService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service("userShopServiceImpl")
@RequiredArgsConstructor
@Slf4j
public class ShopServiceImpl implements ShopService {

    private final ShopRepository shopRepository;

    @Override
    public Integer getStatus() {
        try {
            // 获取第一个店铺的状态（假设只有一个店铺）
            Shop shop = shopRepository.findAll().stream()
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Shop not found"));

            return shop.getStatus();
        } catch (Exception e) {
            log.error("Failed to get shop status", e);
            throw new RuntimeException("Failed to get shop status: " + e.getMessage());
        }
    }
}