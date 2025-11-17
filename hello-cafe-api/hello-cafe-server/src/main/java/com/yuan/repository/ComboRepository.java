package com.yuan.repository;

import com.yuan.dto.ComboPageQueryDTO;
import com.yuan.entity.Combo;
import com.yuan.result.PageResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComboRepository extends JpaRepository<Combo, Long> {

    Optional<Combo> findByName(String name);

    @Query("""
        SELECT c
        FROM Combo c
        JOIN Category cat ON c.categoryId = cat.id
        WHERE (:name IS NULL OR c.name LIKE %:name%)
          AND (:categoryId IS NULL OR c.categoryId = :categoryId)
          AND (:status IS NULL OR c.status = :status)
        ORDER BY c.updateTime DESC
    """)
    Page<Combo> findAllWithCategory(
            @Param("name") String name,
            @Param("categoryId") Integer categoryId,
            @Param("status") Integer status,
            Pageable pageable
    );

    boolean existsByCategoryId(Long categoryId);

    List<Combo> findByStatus(Integer status);

    List<Combo> findByCategoryIdAndStatus(Long categoryId, Integer status);

    @Query("SELECT c.name FROM Combo c WHERE c.id = :comboId")
    String findNameById(Long comboId);


}
