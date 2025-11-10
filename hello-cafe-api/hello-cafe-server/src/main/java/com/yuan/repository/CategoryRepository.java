package com.yuan.repository;

import com.yuan.entity.Category;
import com.yuan.entity.MenuItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAll();

    @Query(value = "select * from category where name = :name", nativeQuery = true)
    Optional<Category> findByName(@Param("name") String name);


    @Query("""
                SELECT c FROM Category c
                WHERE (:name IS NULL OR c.name LIKE %:name%)
                  AND (:type = 0 OR c.type = :type)
                ORDER BY c.updateTime DESC
            """)
    Page<Category> search(@Param("name") String name,
                          @Param("type") int type,
                          Pageable pageable);

    @Query("SELECT COALESCE(MAX(c.sort), 0) FROM Category c")
    Integer findMaxSort();

    List<Category> findByTypeAndStatusOrderBySortAsc(Integer type, Integer status);

    List<Category> findByStatusOrderBySortAsc(Integer status);
}
