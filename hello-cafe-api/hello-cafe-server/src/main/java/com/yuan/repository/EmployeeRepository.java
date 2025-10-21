package com.yuan.hellocafeserver.repository;


import com.yuan.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Employee entity.
 * Provides CRUD operations using Spring Data JPA.
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // You can define custom queries later, e.g.
    // Optional<Employee> findByUsername(String username);
}