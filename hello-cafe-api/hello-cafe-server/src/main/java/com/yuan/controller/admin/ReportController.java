package com.yuan.controller.admin;

import com.yuan.result.Result;
import com.yuan.service.ReportService;
import com.yuan.vo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDate;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/admin/report")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/businessData")
    public Result<BusinessDataVO> getBusinessStatistics(
           ) {
        try {
            log.info("Getting order statistics ");
            BusinessDataVO businessDataVO = reportService.getBusinessData();
            return Result.success(businessDataVO);
        } catch (Exception e) {
            log.error("Failed to get order statistics", e);
            return Result.error("Failed to get order statistics: " + e.getMessage());
        }
    }

    /**
     * revenue statistics interface
     */
    @GetMapping("/revenueStatistics")
    public Result<RevenueVO> getTurnoverStatistics(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate begin,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate end) {
        try {
            log.info("Getting turnover statistics from {} to {}", begin, end);
            RevenueVO revenueReport = reportService.getRevenue(begin, end);
            return Result.success(revenueReport);
        } catch (Exception e) {
            log.error("Failed to get turnover statistics", e);
            return Result.error("Failed to get turnover statistics: " + e.getMessage());
        }
    }

    /**
     * user statistics interface
     */
    @GetMapping("/userStatistics")
    public Result<UserStatVO> getUserStatistics(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate begin,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate end) {
        try {
            log.info("Getting user statistics from {} to {}", begin, end);
            UserStatVO userReport = reportService.getUsers(begin, end);
            return Result.success(userReport);
        } catch (Exception e) {
            log.error("Failed to get user statistics", e);
            return Result.error("Failed to get user statistics: " + e.getMessage());
        }
    }

    /**
     * order statistics interface
     */
    @GetMapping("/ordersStatistics")
    public Result<OrderStatVO> getOrderStatistics(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate begin,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate end) {
        try {
            log.info("Getting order statistics from {} to {}", begin, end);
            OrderStatVO orderReport = reportService.getOrders(begin, end);
            return Result.success(orderReport);
        } catch (Exception e) {
            log.error("Failed to get order statistics", e);
            return Result.error("Failed to get order statistics: " + e.getMessage());
        }
    }

    /**
     * query sales top 10
     */
    @GetMapping("/top10")
    public Result<SalesTop10VO> getSalesTop10(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate begin,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate end) {
        try {
            log.info("Getting sales top 10 from {} to {}", begin, end);
            SalesTop10VO salesTop10 = reportService.getTop10(begin, end);
            return Result.success(salesTop10);
        } catch (Exception e) {
            log.error("Failed to get sales top 10", e);
            return Result.error("Failed to get sales top 10: " + e.getMessage());
        }
    }
}