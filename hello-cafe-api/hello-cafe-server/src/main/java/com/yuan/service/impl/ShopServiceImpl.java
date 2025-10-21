package com.yuan.service.impl;

import com.yuan.entity.Shop;
import com.yuan.repository.ShopRepository;
import com.yuan.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ShopServiceImpl implements ShopService {

    private final ShopRepository shopRepository;

    @Override
    public Shop getShopStatus() {
        return shopRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
    }

    @Override
    public Shop updateShopStatus(Integer status) {
        Shop shop = shopRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
        shop.setStatus(status);
        shop.setUpdateTime(LocalDateTime.now());
        return shopRepository.save(shop);
    }
}
