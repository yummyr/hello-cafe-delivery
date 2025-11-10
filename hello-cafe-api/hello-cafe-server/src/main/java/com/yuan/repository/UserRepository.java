package com.yuan.repository;

import com.yuan.entity.Employee;
import com.yuan.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
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

    @Query("SELECT u.createDate as date, COUNT(u) as newUserCount " +
           "FROM User u WHERE u.createDate >= :begin AND u.createDate <= :end " +
           "GROUP BY u.createDate ORDER BY u.createDate")
    List<Object[]> getDailyNewUsers(@Param("begin") LocalDate begin, @Param("end") LocalDate end);

    @Query("SELECT u.createDate as date, COUNT(u) as totalUserCount " +
           "FROM User u WHERE u.createDate <= :date " +
           "GROUP BY u.createDate ORDER BY u.createDate")
    List<Object[]> getDailyTotalUsers(@Param("date") LocalDate date);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createDate >= :begin")
    Integer countNewUsers(LocalDate begin);
}
