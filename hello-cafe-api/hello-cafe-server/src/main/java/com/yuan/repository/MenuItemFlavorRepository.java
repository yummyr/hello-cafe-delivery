package com.yuan.repository;

import com.yuan.entity.MenuItemFlavor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemFlavorRepository extends JpaRepository<MenuItemFlavor, Long> {

    List<MenuItemFlavor> findByMenuItemId(Long menuItemId);

    @Modifying
    @Query(value = "DELETE FROM menu_item_flavors WHERE menu_item_id = :menuItemId", nativeQuery = true)
    void deleteByMenuItemId(@Param("menuItemId") Long menuItemId);

    void deleteByMenuItemIdIn(List<Long> menuItemIds);
}