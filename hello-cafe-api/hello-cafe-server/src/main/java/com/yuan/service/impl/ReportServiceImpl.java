package com.yuan.service.impl;

import com.yuan.repository.OrdersRepository;
import com.yuan.repository.UserRepository;
import com.yuan.service.ReportService;
import com.yuan.vo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class ReportServiceImpl implements ReportService {

    private final OrdersRepository ordersRepository;
    private final UserRepository userRepository;

    @Override
    public BusinessDataVO getBusinessData() {
        try {

            log.info("Querying business data from {} to {}", LocalDate.now(), LocalDate.now());

            // convert to LocalDateTime
            LocalDateTime beginTime = LocalDate.now().atStartOfDay();
            LocalDateTime endTime = LocalDate.now().atTime(LocalTime.MAX);

            // count today's orders
            Long todayOrders = ordersRepository.countTodayOrders(beginTime, endTime);
            log.info("Today's total orders: {}", todayOrders);

            // calculate today's completed orders
            Long validOrders = ordersRepository.countTodayCompletedOrders(beginTime, endTime);
            log.info("Today's completed orders: {}", validOrders);

            // calculate today's revenue
            Double revenue = ordersRepository.sumTodayRevenue(beginTime, endTime);
            if (revenue == null) revenue = 0.0;
            log.info("Today's revenue: {}", revenue);

            // calculate order completion rate
            double orderCompletionRate = 0.0;
            if (todayOrders != null && todayOrders > 0) {
                orderCompletionRate = (validOrders.doubleValue() / todayOrders.doubleValue()) * 100;
            }
            log.info("Order completion rate: {}%", orderCompletionRate);

            // calculate average order value
            double unitPrice = 0.0;
            if (validOrders != null && validOrders > 0) {
                unitPrice = revenue / validOrders;
            }
            log.info("Average order value: {}", unitPrice);

            // calculate new users on each day
            Integer newUsers = 0;
            if (beginTime.equals(endTime)) {
                newUsers = userRepository.countNewUsers(beginTime.toLocalDate());
            }
            BusinessDataVO result = new BusinessDataVO(revenue, validOrders.intValue(), orderCompletionRate, unitPrice, newUsers);
            log.info("Business data result: {}", result);

            return result;

        } catch (Exception e) {
            log.error("Error in getBusinessData", e);
            // Return default values instead of throwing exception
            return new BusinessDataVO(0.0, 0, 0.0, 0.0, 0);
        }
    }


    @Override
    public RevenueVO getRevenue(LocalDate begin, LocalDate end) {
        LocalDateTime beginTime = begin.atStartOfDay();
        LocalDateTime endTime = end.atTime(LocalTime.MAX);

        // 查询每日营业额
        List<Object[]> dailyRevenueList = ordersRepository.getDailyRevenue(beginTime, endTime);

        List<String> dateList = new ArrayList<>();
        List<Double> revenueList = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        Map<LocalDate, Double> revenueMap = new HashMap<>();
        for (Object[] result : dailyRevenueList) {
            LocalDate resultDate = convertToLocalDate(result[0]);
            Double dailyRevenue = result[1] != null ? ((Number) result[1]).doubleValue() : 0.0;
            revenueMap.put(resultDate, dailyRevenue);
        }

        // 填充数据
        for (LocalDate date = begin; !date.isAfter(end); date = date.plusDays(1)) {
            dateList.add(date.format(formatter));
            revenueList.add(revenueMap.getOrDefault(date, 0.0));
        }

        return new RevenueVO(
                String.join(",", dateList),
                revenueList.stream().map(String::valueOf).collect(Collectors.joining(","))
        );
    }

    @Override
    public UserStatVO getUsers(LocalDate begin, LocalDate end) {
        // 查询每日新增用户
        List<Object[]> dailyNewUsersList = userRepository.getDailyNewUsers(begin, end);

        List<String> dateList = new ArrayList<>();
        List<Integer> newUserList = new ArrayList<>();
        List<Integer> totalUserList = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        int totalUsers = 0;

        // 填充数据
        for (LocalDate date = begin; !date.isAfter(end); date = date.plusDays(1)) {
            dateList.add(date.format(formatter));

            Integer dailyNewUsers = 0;
            for (Object[] result : dailyNewUsersList) {
                LocalDate resultDate = (LocalDate) result[0];
                if (resultDate.equals(date)) {
                    dailyNewUsers = ((Number) result[1]).intValue();
                    break;
                }
            }
            newUserList.add(dailyNewUsers);
            totalUsers += dailyNewUsers;
            totalUserList.add(totalUsers);
        }

        return new UserStatVO(
                String.join(",", dateList),
                newUserList.stream().map(String::valueOf).collect(Collectors.joining(",")),
                totalUserList.stream().map(String::valueOf).collect(Collectors.joining(","))
        );
    }

    @Override
    public OrderStatVO getOrders(LocalDate begin, LocalDate end) {
        // 转换为LocalDateTime
        LocalDateTime beginTime = begin.atStartOfDay();
        LocalDateTime endTime = end.atTime(LocalTime.MAX);

        // 查询每日订单数据
        List<Object[]> dailyOrderCountList = ordersRepository.getDailyOrderCount(beginTime, endTime);
        List<Object[]> dailyValidOrderCountList = ordersRepository.getDailyValidOrderCount(beginTime, endTime);

        List<String> dateList = new ArrayList<>();
        List<Integer> orderCountList = new ArrayList<>();
        List<Integer> validOrderCountList = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // 创建映射
        Map<LocalDate, Integer> orderCountMap = new HashMap<>();
        for (Object[] result : dailyOrderCountList) {
            LocalDate resultDate = convertToLocalDate(result[0]);
            Integer count = result[1] != null ? ((Number) result[1]).intValue() : 0;
            orderCountMap.put(resultDate, count);
        }

        Map<LocalDate, Integer> validOrderCountMap = new HashMap<>();
        for (Object[] result : dailyValidOrderCountList) {
            LocalDate resultDate = convertToLocalDate(result[0]);
            Integer count = result[1] != null ? ((Number) result[1]).intValue() : 0;
            validOrderCountMap.put(resultDate, count);
        }
        int totalOrderCount = 0;
        int totalValidOrderCount = 0;

        // 填充数据
        for (LocalDate date = begin; !date.isAfter(end); date = date.plusDays(1)) {
            dateList.add(date.format(formatter));

            Integer dailyOrderCount = orderCountMap.getOrDefault(date, 0);
            orderCountList.add(dailyOrderCount);
            totalOrderCount += dailyOrderCount;

            Integer dailyValidOrderCount = validOrderCountMap.getOrDefault(date, 0);
            validOrderCountList.add(dailyValidOrderCount);
            totalValidOrderCount += dailyValidOrderCount;
        }
        Double orderCompletionRate = totalOrderCount > 0 ?
                (totalValidOrderCount * 100.0 / totalOrderCount) : 0.0;

        return new OrderStatVO(
                String.join(",", dateList),
                orderCountList.stream().map(String::valueOf).collect(Collectors.joining(",")),
                validOrderCountList.stream().map(String::valueOf).collect(Collectors.joining(",")),
                totalOrderCount,
                totalValidOrderCount,
                orderCompletionRate
        );

    }

    @Override
    public SalesTop10VO getTop10(LocalDate begin, LocalDate end) {
        // 转换为LocalDateTime
        LocalDateTime beginTime = begin.atStartOfDay();
        LocalDateTime endTime = end.atTime(LocalTime.MAX);

        // 查询销量top10
        List<Object[]> salesTop10List = ordersRepository.getSalesTop10(beginTime, endTime);

        List<String> nameList = new ArrayList<>();
        List<Integer> numberList = new ArrayList<>();

        for (Object[] result : salesTop10List) {
            nameList.add((String) result[0]);
            numberList.add(((Number) result[1]).intValue());
        }

        return new SalesTop10VO(
                String.join(",", nameList),
                numberList.stream().map(String::valueOf).collect(Collectors.joining(","))
        );
    }

    private LocalDate convertToLocalDate(Object dateObject) {
        if (dateObject == null) {
            return null;
        }
        if (dateObject instanceof LocalDate) {
            return (LocalDate) dateObject;
        } else if (dateObject instanceof java.sql.Date) {
            return ((java.sql.Date) dateObject).toLocalDate();
        } else if (dateObject instanceof java.util.Date) {
            return ((java.util.Date) dateObject).toInstant()
                    .atZone(java.time.ZoneId.systemDefault())
                    .toLocalDate();
        } else if (dateObject instanceof String) {
            return LocalDate.parse((String) dateObject);
        } else {
            throw new IllegalArgumentException("Unsupported date type: " + dateObject.getClass().getName());
        }
}}