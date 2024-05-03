package com.springboot.fstore.service.impl;

import com.springboot.fstore.entity.Order;
import com.springboot.fstore.payload.CustomerReport;
import com.springboot.fstore.payload.FoodReport;
import com.springboot.fstore.payload.SalesReport;
import com.springboot.fstore.repository.OrderRepository;
import com.springboot.fstore.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final OrderRepository orderRepository;


    @Override
    public List<SalesReport> getSalesReport(Date startDate, Date endDate) {

        LocalDateTime startDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime endDateTime = endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        endDateTime = endDateTime.plusDays(1);

        List<SalesReport> salesReportList = new ArrayList<>();

        List<Order> orderList = orderRepository.findAllByCreatedAtBetween(startDateTime, endDateTime);

        for (Order order : orderList) {
            if (!salesReportList.isEmpty()
                    && salesReportList.get(salesReportList.size() - 1).getDate().toLocalDate()
                    .equals(order.getCreatedAt().toLocalDate())) {
                salesReportList.get(salesReportList.size() - 1).setRevenue(salesReportList.get(salesReportList.size() - 1).getRevenue() + order.getTotal());
            } else {
                salesReportList.add(SalesReport.builder()
                        .date(order.getCreatedAt())
                        .revenue(order.getTotal())
                        .build());
            }
        }

        return salesReportList;
    }

    @Override
    public List<FoodReport> getFoodReport(Date startDate, Date endDate) {
        LocalDateTime startDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime endDateTime = endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        endDateTime = endDateTime.plusDays(1);

        List<Order> orderList = orderRepository.findAllByCreatedAtBetween(startDateTime, endDateTime);
        List<FoodReport> foodReportList = new ArrayList<>();

        for (Order order : orderList) {
            order.getItems().forEach(cart -> {
                if (!foodReportList.isEmpty() && foodReportList.stream().anyMatch(foodReport -> foodReport.getFoodId() == cart.getFood().getId())) {
                    FoodReport foodReport = foodReportList.stream().filter(report -> report.getFoodId() == cart.getFood().getId()).findFirst().get();
                    foodReport.setQuantity(foodReport.getQuantity() + cart.getQuantity());
                    foodReport.setTotalSales(foodReport.getTotalSales() + cart.getPrice());
                } else {
                    foodReportList.add(FoodReport.builder()
                            .foodId(cart.getFood().getId())
                            .quantity(cart.getQuantity())
                            .totalSales(cart.getPrice())
                            .build());
                }
            });
        }

        foodReportList.sort((o1, o2) -> o2.getQuantity() - o1.getQuantity());

        return foodReportList;
    }

    @Override
    public List<CustomerReport> getCustomerReport(Date startDate, Date endDate) {
        LocalDateTime startDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime endDateTime = endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        endDateTime = endDateTime.plusDays(1);

        List<Order> orderList = orderRepository.findAllByCreatedAtBetween(startDateTime, endDateTime);
        List<CustomerReport> customerReportList = new ArrayList<>();

        for (Order order : orderList) {
            if (!customerReportList.isEmpty() && customerReportList.stream().anyMatch(customerReport -> customerReport.getUserId() == order.getUser().getId())) {
                CustomerReport customerReport = customerReportList.stream().filter(report -> report.getUserId() == order.getUser().getId()).findFirst().get();
                customerReport.setTotalSpent(customerReport.getTotalSpent() + order.getTotal());
                customerReport.setTotalOrder(customerReport.getTotalOrder() + 1);
            } else {
                customerReportList.add(CustomerReport.builder()
                        .userId(order.getUser().getId())
                        .totalSpent(order.getTotal())
                        .totalOrder(1)
                        .build());
            }
        }

        customerReportList.sort((o1, o2) -> (int) (o2.getTotalSpent() - o1.getTotalSpent()));

        return customerReportList;
    }
}
