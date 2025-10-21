package com.yuan.repository;

import com.yuan.entity.Employee;
import com.yuan.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for User entity.
 * Provides CRUD operations using Spring Data JPA.
 */

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<Object> findByUsername(String username);

    // save user
    User save(User user);


}
