package com.yuan.repository;

import com.yuan.entity.AddressBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressBookRepository extends JpaRepository<AddressBook, Long> {

    List<AddressBook> findByUserId(Long userId);

    AddressBook findByUserIdAndIsDefault(Long userId, Integer isDefault);

    @Modifying
    @Query("UPDATE AddressBook a SET a.isDefault = 0 WHERE a.userId = :userId")
    void unsetDefaultAddress(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE AddressBook a SET a.isDefault = 1 WHERE a.id = :id")
    void setDefaultAddress(@Param("id") Long id);
}