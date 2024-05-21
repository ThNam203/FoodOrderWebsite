package com.springboot.fstore.service;

import com.springboot.fstore.payload.reports.FoodReport;
import com.springboot.fstore.payload.reports.ReportValue;
import com.springboot.fstore.payload.reports.SalesReport;

import java.util.Date;
import java.util.List;

public interface ReportService {
    List<ReportValue> getOrderByMonth(Date startDate, Date endDate);
    List<ReportValue> getTotalCompletedOrderByMonth(Date startDate, Date endDate);
    List<ReportValue> getAverageRevenueByMonth(Date startDate, Date endDate);
    List<ReportValue> getCancelledOrderByMonth(Date startDate, Date endDate);
    List<ReportValue> getCancellationRateByMonth(Date startDate, Date endDate);
    List<ReportValue> getRevenueByMonth(Date startDate, Date endDate);
    List<FoodReport> getTopFoodByRevenue(Date startDate, Date endDate);
    List<FoodReport> getTopFoodByOrder(Date startDate, Date endDate);
    List<ReportValue> getCustomerTransaction(Date startDate, Date endDate);
}
