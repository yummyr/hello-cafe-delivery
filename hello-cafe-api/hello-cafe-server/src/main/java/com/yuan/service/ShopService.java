package com.yuan.service;

import com.yuan.entity.Shop;

public interface ShopService {
    Shop getShopStatus();
    Shop updateShopStatus(Integer status);
}
