package com.yuan.repository;

import com.yuan.entity.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Long> {

    List<ShoppingCart> findByUserId(Long userId);

    @Modifying
    @Query("DELETE FROM ShoppingCart s WHERE s.userId = :userId")
    void deleteByUserId(@Param("userId") Long userId);

    ShoppingCart findByUserIdAndMenuItemIdAndFlavor(Long userId, Long menuItemId, String flavor);

    ShoppingCart findByUserIdAndComboId(Long userId, Long comboId);
}