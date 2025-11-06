package com.yuan.service.impl;

import com.yuan.constant.RedisConstant;
import com.yuan.service.ShopService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;


@Service
@Slf4j
@RequiredArgsConstructor
public class ShopServiceImpl implements ShopService {

    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    public Integer getShopStatus() {
        try {
            Object status = redisTemplate.opsForValue().get(RedisConstant.SHOP_STATUS_KEY);
            if (status == null) {
                log.warn("Shop status not found in redis cache, return default status:{}", RedisConstant.DEFAULT_SHOP_STATUS);
                setDefaultShopStatus();
                return RedisConstant.DEFAULT_SHOP_STATUS;
            }
            Integer shopStatus = Integer.valueOf(status.toString());
            // log.info("Shop status found in redis cache:{}", shopStatus);
            return shopStatus;
        } catch (Exception e) {
            log.error("Failed to get shop status from redis cache: {}", e.getMessage());
            return RedisConstant.DEFAULT_SHOP_STATUS;
        }
    }

    private void setDefaultShopStatus() {
        try {
            // log.info("Set default shop status in redis cache:{}", RedisConstant.DEFAULT_SHOP_STATUS);
            redisTemplate.opsForValue().set(RedisConstant.SHOP_STATUS_KEY, RedisConstant.DEFAULT_SHOP_STATUS);
        } catch (Exception e) {
            log.error("Failed to set default shop status in redis cache: {}", e.getMessage());
        }
    }

    @Override
    @Transactional
    public void updateShopStatus(Integer status) {
        try {
            // log.info("Try to update shop status using new status passed :{}", status);
            if (status == null || (status != 0 && status != 1)) {
                throw new IllegalArgumentException("Invalid status value (must be 0 or 1)");
            }
            redisTemplate.opsForValue().set(RedisConstant.SHOP_STATUS_KEY, status);
            // log.info("Shop status updated successfully:{}", status);
        } catch (Exception e) {
            log.error("Failed to update shop status: {}", e.getMessage());
        }
    }
}

