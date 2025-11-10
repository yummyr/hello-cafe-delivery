package com.yuan.service;

import com.yuan.vo.*;

import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDate;

public interface ReportService {


    BusinessDataVO getBusinessData();


    RevenueVO getRevenue(LocalDate begin, LocalDate end);

    UserStatVO getUsers(LocalDate begin, LocalDate end);

    OrderStatVO getOrders(LocalDate begin, LocalDate end);

    SalesTop10VO getTop10(LocalDate begin, LocalDate end);
}