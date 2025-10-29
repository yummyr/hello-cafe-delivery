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
    SELECT new com.yuan.vo.MenuItemVO(
        m.id,
        m.name,
        m.image,
        c.name,
        m.price,
        m.status,
        m.updateTime
    )
    FROM MenuItem m
    JOIN Category c ON m.categoryId = c.id
    ORDER BY m.updateTime DESC
""")
    Page<MenuItemVO> findAllWithCategory(Pageable pageable);

}
