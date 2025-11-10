package com.yuan.repository;

import com.yuan.entity.ComboItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComboItemRepository extends JpaRepository<ComboItem, Long> {

    @Query("SELECT ci FROM ComboItem ci WHERE ci.menuItemId IN :menuItemIds")
    List<ComboItem> findByMenuItemIdIn(@Param("menuItemIds") List<Long> menuItemIds);

    List<ComboItem> findByMenuItemId(Long menuItemId);

    List<ComboItem> findByComboId(Long comboId);

    void deleteByMenuItemId(Long menuItemId);

    void deleteByMenuItemIdIn(List<Long> menuItemIds);

    @Modifying
    @Query(value = "DELETE FROM combo_item WHERE combo_id = :comboId", nativeQuery = true)
    void deleteByComboId(@Param("comboId") Long comboId);
}
