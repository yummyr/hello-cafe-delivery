package com.yuan.repository;

import com.yuan.entity.MenuItem;
import com.yuan.vo.MenuItemVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    @Query(value = "select * from menu_item where name = :name", nativeQuery = true)
    Optional<MenuItem> findByName(@Param("name")String name);

    boolean existsByCategoryId(Long categoryId);

    Page<MenuItem> findAll(Pageable pageable);
    @Query("""
        SELECT mi
        FROM MenuItem mi
        JOIN Category c ON mi.categoryId = c.id
        WHERE (:name IS NULL OR mi.name LIKE %:name%)
          AND (:categoryName IS NULL OR c.name LIKE %:categoryName%)
          AND (:status IS NULL OR mi.status = :status)
        ORDER BY mi.updateTime DESC
    """)
    Page<MenuItem> findAllWithCategory(
            @Param("name") String name,
            @Param("categoryName") String categoryName,
            @Param("status") Integer status,
            Pageable pageable
    );

}
