package com.yuan.service;

import com.yuan.entity.Shop;
import jakarta.persistence.criteria.CriteriaBuilder;

import java.util.Optional;

public interface ShopService {
    Integer getShopStatus();
    void updateShopStatus(Integer status);
}
