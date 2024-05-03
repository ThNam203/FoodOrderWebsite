package com.springboot.fstore.service;

import com.springboot.fstore.payload.CustomerReport;
import com.springboot.fstore.payload.FoodReport;
import com.springboot.fstore.payload.SalesReport;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public interface ReportService {
    List<SalesReport> getSalesReport(Date startDate, Date endDate);
    List<FoodReport> getFoodReport(Date startDate, Date endDate);
    List<CustomerReport> getCustomerReport(Date startDate, Date endDate);
}
