package com.yuan.repository;

import com.yuan.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    @Query(value = "select * from menu_item where name = :name", nativeQuery = true)
    Optional<MenuItem> findByName(@Param("name")String name);

}
