package com.yuan.repository;

import com.yuan.entity.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Long> {

    @Query("SELECT COUNT(o) FROM Orders o WHERE o.orderTime >= :begin AND o.orderTime < :end")
    Long countTodayOrders(@Param("begin") LocalDateTime begin, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(o) FROM Orders o WHERE o.orderTime >= :begin AND o.orderTime < :end AND o.status = 5")
    Long countTodayCompletedOrders(@Param("begin") LocalDateTime begin, @Param("end") LocalDateTime end);

    @Query("SELECT SUM(o.amount) FROM Orders o WHERE o.orderTime >= :begin AND o.orderTime < :end AND o.status = 5")
    Double sumTodayRevenue(@Param("begin") LocalDateTime begin, @Param("end") LocalDateTime end);

    @Query("SELECT o FROM Orders o WHERE o.status IN :statuses")
    List<Orders> findByStatusIn(@Param("statuses") List<Integer> statuses);

    @Query("SELECT COUNT(o) FROM Orders o WHERE o.status = :status")
    Long countByStatus(@Param("status") Integer status);


    @Query("SELECT DATE(o.orderTime) as orderDate, SUM(o.amount) as dailyRevenue " +
            "FROM Orders o WHERE o.orderTime >= :begin AND o.orderTime < :end AND o.status = 5 " +
            "GROUP BY DATE(o.orderTime) ORDER BY DATE(o.orderTime)")
    List<Object[]> getDailyRevenue(@Param("begin") LocalDateTime begin, @Param("end") LocalDateTime end);

    @Query("SELECT DATE(o.orderTime) as orderDate, COUNT(o) as dailyOrderCount " +
            "FROM Orders o WHERE o.orderTime >= :begin AND o.orderTime < :end " +
            "GROUP BY DATE(o.orderTime) ORDER BY DATE(o.orderTime)")
    List<Object[]> getDailyOrderCount(@Param("begin") LocalDateTime begin, @Param("end") LocalDateTime end);

    @Query("SELECT DATE(o.orderTime) as orderDate, COUNT(o) as dailyValidOrderCount " +
            "FROM Orders o WHERE o.orderTime >= :begin AND o.orderTime < :end AND o.status = 5 " +
            "GROUP BY DATE(o.orderTime) ORDER BY DATE(o.orderTime)")
    List<Object[]> getDailyValidOrderCount(@Param("begin") LocalDateTime begin, @Param("end") LocalDateTime end);

    @Query(value = "SELECT oi.name, SUM(oi.quantity) as totalSales " +
            "FROM order_detail oi " +
            "JOIN orders o ON oi.order_id = o.id " +
            "WHERE o.order_time >= :begin AND o.order_time < :end AND o.status = 5 " +
            "GROUP BY oi.name " +
            "ORDER BY totalSales DESC " +
            "LIMIT 10", nativeQuery = true)
    List<Object[]> getSalesTop10(@Param("begin") LocalDateTime begin, @Param("end") LocalDateTime end);

    List<Orders> findByNumberContainingAndStatusAndOrderTimeBetween(
            String number, Integer status, LocalDateTime beginTime, LocalDateTime endTime);

    List<Orders> findByPhoneContainingAndStatusAndOrderTimeBetween(
            String phone, Integer status, LocalDateTime beginTime, LocalDateTime endTime);

    Page<Orders> findAllByStatusAndOrderTimeBetween(Integer status, LocalDateTime beginTime, LocalDateTime endTime, Pageable pageable);

    Page<Orders> findAllByOrderTimeBetween(LocalDateTime beginTime, LocalDateTime endTime, Pageable pageable);

    Page<Orders> findByUserIdAndStatus(Long userId, Integer status, Pageable pageable);

    Page<Orders> findByUserId(Long userId, Pageable pageable);

    Orders findByNumber(String orderNumber);


    @Query("SELECT o FROM Orders o WHERE " +
            "(:number IS NULL OR o.number LIKE %:number%) AND " +
            "(:phone IS NULL OR o.phone LIKE %:phone%) AND " +
            "(:status IS NULL OR o.status = :status) AND " +
            "(:beginTime IS NULL OR o.orderTime >= :beginTime) AND " +
            "(:endTime IS NULL OR o.orderTime <= :endTime)")
    Page<Orders> findAll(
            @Param("number") String number,
            @Param("phone") String phone,
            @Param("status") Integer status,
            @Param("beginTime") LocalDateTime beginTime,
            @Param("endTime") LocalDateTime endTime,
            Pageable pageable
    );

    @Query("SELECT o.number FROM Orders o WHERE o.id = :orderId")
    String findNumberById(Long orderId);

    @Query("SELECT COUNT(o) FROM Orders o WHERE o.orderTime >= :begin AND o.orderTime < :end")
    Integer countNewUsers(LocalDateTime begin, LocalDateTime end);
}