package com.yuan.service.impl;

import com.yuan.entity.Shop;
import com.yuan.repository.ShopRepository;
import com.yuan.service.ShopService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ShopServiceImpl implements ShopService {

    private final ShopRepository shopRepository;

    @Override
    public Integer getShopStatus() {
        Optional<Shop> shop = shopRepository.findById(1L);

        if (shop.isPresent()) {
            return shop.get().getStatus();
        } else {
            throw new RuntimeException("Shop not found with id: 1");
        }

    }

    @Override
    @Transactional
    public void updateShopStatus(Integer status) {
        log.info("Try to update shop status using new status passed :{}", status);
       shopRepository.updateShopStatus(status,LocalDateTime.now(),1L);
    }
}
