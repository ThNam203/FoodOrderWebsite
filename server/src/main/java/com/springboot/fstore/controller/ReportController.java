package com.springboot.fstore.controller;

import com.springboot.fstore.payload.reports.FoodReport;
import com.springboot.fstore.payload.reports.ReportValue;
import com.springboot.fstore.payload.reports.SalesReport;
import com.springboot.fstore.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @GetMapping("order-by-month")
    public ResponseEntity<List<ReportValue>> getSalesReport(
            @RequestParam(name = "start") @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam(name = "end") @DateTimeFormat(pattern = "yyyy-MM-dd") Date end) {
        return ResponseEntity.ok(reportService.getOrderByMonth(start, end));
    }

    @GetMapping("total-completed-order-by-month")
    public ResponseEntity<List<ReportValue>> getTotalCompletedOrderByMonth(
            @RequestParam(name = "start") @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam(name = "end") @DateTimeFormat(pattern = "yyyy-MM-dd") Date end) {
        return ResponseEntity.ok(reportService.getTotalCompletedOrderByMonth(start, end));
    }

    @GetMapping("average-revenue-by-month")
    public ResponseEntity<List<ReportValue>> getAverageRevenueByMonth(
            @RequestParam(name = "start") @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam(name = "end") @DateTimeFormat(pattern = "yyyy-MM-dd") Date end) {
        return ResponseEntity.ok(reportService.getAverageRevenueByMonth(start, end));
    }

    @GetMapping("cancelled-order-by-month")
    public ResponseEntity<List<ReportValue>> getCancelledOrderByMonth(
            @RequestParam(name = "start") @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam(name = "end") @DateTimeFormat(pattern = "yyyy-MM-dd") Date end) {
        return ResponseEntity.ok(reportService.getCancelledOrderByMonth(start, end));
    }

    @GetMapping("cancellation-rate-by-month")
    public ResponseEntity<List<ReportValue>> getCancellationRateByMonth(
            @RequestParam(name = "start") @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam(name = "end") @DateTimeFormat(pattern = "yyyy-MM-dd") Date end) {
        return ResponseEntity.ok(reportService.getCancellationRateByMonth(start, end));
    }

    @GetMapping("revenue-by-month")
    public ResponseEntity<List<ReportValue>> getRevenueByMonth(
            @RequestParam(name = "start") @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam(name = "end") @DateTimeFormat(pattern = "yyyy-MM-dd") Date end) {
        return ResponseEntity.ok(reportService.getRevenueByMonth(start, end));
    }

    @GetMapping("customer-transaction")
    public ResponseEntity<List<ReportValue>> getCustomerTransaction(
            @RequestParam(name = "start") @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam(name = "end") @DateTimeFormat(pattern = "yyyy-MM-dd") Date end) {
        return ResponseEntity.ok(reportService.getCustomerTransaction(start, end));
    }

    @GetMapping("top-food-by-revenue")
    public ResponseEntity<List<FoodReport>> getTopFoodByRevenue(
            @RequestParam(name = "start") @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam(name = "end") @DateTimeFormat(pattern = "yyyy-MM-dd") Date end) {
        return ResponseEntity.ok(reportService.getTopFoodByRevenue(start, end));
    }

    @GetMapping("top-food-by-order")
    public ResponseEntity<List<FoodReport>> getTopFoodByOrder(
            @RequestParam(name = "start") @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam(name = "end") @DateTimeFormat(pattern = "yyyy-MM-dd") Date end) {
        return ResponseEntity.ok(reportService.getTopFoodByOrder(start, end));
    }

}
