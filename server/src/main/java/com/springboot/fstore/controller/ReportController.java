package com.springboot.fstore.controller;

import com.springboot.fstore.payload.CustomerReport;
import com.springboot.fstore.payload.FoodReport;
import com.springboot.fstore.payload.SalesReport;
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
    @GetMapping("sales-with-profit")
    public ResponseEntity<List<SalesReport>> getSalesReport(
            @RequestParam(name = "start") @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam(name = "end") @DateTimeFormat(pattern = "yyyy-MM-dd") Date end) {
        return ResponseEntity.ok(reportService.getSalesReport(start, end));
    }

    @GetMapping("sales-with-food")
    public ResponseEntity<List<FoodReport>> getProductReport(
            @RequestParam(name = "start") @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam(name = "end") @DateTimeFormat(pattern = "yyyy-MM-dd") Date end) {
        return ResponseEntity.ok(reportService.getFoodReport(start, end));
    }

    @GetMapping("sales-with-customer")
    public ResponseEntity<List<CustomerReport>> getCustomerReport(
            @RequestParam(name = "start") @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam(name = "end") @DateTimeFormat(pattern = "yyyy-MM-dd") Date end) {
        return ResponseEntity.ok(reportService.getCustomerReport(start, end));
    }

}
