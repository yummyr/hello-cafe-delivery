package com.yuan.repository;

import com.yuan.entity.Combos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CombosRepository extends JpaRepository<Combos, Long> {

    @Query("SELECT ci FROM Combos ci WHERE ci.menuItemId IN :menuItemIds")
    List<Combos> findByMenuItemIdIn(@Param("menuItemIds") List<Long> menuItemIds);

    List<Combos> findByMenuItemId(Long menuItemId);

    List<Combos> findByComboId(Long comboId);

    void deleteByMenuItemId(Long menuItemId);

    void deleteByMenuItemIdIn(List<Long> menuItemIds);

    @Modifying
    @Query(value = "DELETE FROM combos WHERE combo_id = :comboId", nativeQuery = true)
    void deleteByComboId(@Param("comboId") Long comboId);
}
