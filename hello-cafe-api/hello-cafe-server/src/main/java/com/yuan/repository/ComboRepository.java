package com.yuan.repository;

import com.yuan.entity.Combo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComboRepository extends JpaRepository<Combo,Long> {


    boolean existsByCategoryId(Long id);

}
