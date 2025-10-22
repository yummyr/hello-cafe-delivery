package com.yuan.repository;

import com.yuan.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
    Optional<Shop> findById(Long id);
    @Modifying
    @Query(value = "UPDATE Shop s SET s.status = :status, s.update_time = :updateTime WHERE s.id = :id", nativeQuery = true)
    void updateShopStatus(@Param("status") Integer status,
                          @Param("updateTime") LocalDateTime updateTime,
                          @Param("id") Long id);
}
