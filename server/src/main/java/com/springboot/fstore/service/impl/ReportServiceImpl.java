package com.springboot.fstore.service.impl;

import com.springboot.fstore.entity.Cart;
import com.springboot.fstore.entity.Order;
import com.springboot.fstore.mapper.FoodMapper;
import com.springboot.fstore.payload.reports.FoodReport;
import com.springboot.fstore.payload.reports.FoodReportValue;
import com.springboot.fstore.payload.reports.ReportValue;
import com.springboot.fstore.repository.OrderRepository;
import com.springboot.fstore.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final OrderRepository orderRepository;


    @Override
    public List<ReportValue> getOrderByMonth(Date startDate, Date endDate) {
        LocalDateTime startDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime endDateTime = endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        endDateTime = endDateTime.plusDays(1);

        List<Order> orderList = orderRepository.findAllByCreatedAtBetween(startDateTime, endDateTime);

        List<ReportValue> reportValueList = initReportValueList(startDateTime, endDateTime);

        for (Order order : orderList) {
            reportValueList.stream()
                    .filter(reportValue -> reportValue.getMonth() == order.getCreatedAt().getMonthValue()
                            && reportValue.getYear() == order.getCreatedAt().getYear())
                    .findFirst()
                    .ifPresent(reportValue -> reportValue.setValue(reportValue.getValue() + 1));
        }

        return reportValueList;
    }

    @Override
    public List<ReportValue> getTotalCompletedOrderByMonth(Date startDate, Date endDate) {
        LocalDateTime startDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime endDateTime = endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        endDateTime = endDateTime.plusDays(1);

        List<Order> orderList = orderRepository.findAllByCreatedAtBetween(startDateTime, endDateTime);

        List<ReportValue> reportValueList = initReportValueList(startDateTime, endDateTime);

        for (Order order : orderList) {
            if (!order.getStatus().equals("DELIVERED")) continue;

            reportValueList.stream()
                    .filter(reportValue -> reportValue.getMonth() == order.getCreatedAt().getMonthValue()
                            && reportValue.getYear() == order.getCreatedAt().getYear())
                    .findFirst()
                    .ifPresent(reportValue -> reportValue.setValue(reportValue.getValue() + 1));
        }

        return reportValueList;
    }

    @Override
    public List<ReportValue> getAverageRevenueByMonth(Date startDate, Date endDate) {
        LocalDateTime startDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime endDateTime = endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        endDateTime = endDateTime.plusDays(1);

        List<Order> orderList = orderRepository.findAllByCreatedAtBetween(startDateTime, endDateTime);

        List<ReportValue> reportValueList = initReportValueList(startDateTime, endDateTime);

        for (ReportValue reportValue : reportValueList) {
            double totalRevenue = 0;
            int totalOrder = 0;
            for (Order order : orderList) {
                if (!order.getStatus().equals("DELIVERED")) continue;

                if (order.getCreatedAt().getMonthValue() == reportValue.getMonth()
                        && order.getCreatedAt().getYear() == reportValue.getYear()) {
                    totalRevenue += order.getTotal();
                    totalOrder++;
                }
            }
            if (totalOrder != 0) {
                reportValue.setValue(totalRevenue / totalOrder);
            }
        }

        return reportValueList;
    }

    @Override
    public List<ReportValue> getCancelledOrderByMonth(Date startDate, Date endDate) {
        LocalDateTime startDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime endDateTime = endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        endDateTime = endDateTime.plusDays(1);

        List<Order> orderList = orderRepository.findAllByCreatedAtBetween(startDateTime, endDateTime);

        List<ReportValue> reportValueList = initReportValueList(startDateTime, endDateTime);

        for (Order order : orderList) {
            if (!order.getStatus().equals("CANCELLED")) continue;

            reportValueList.stream()
                    .filter(reportValue -> reportValue.getMonth() == order.getCreatedAt().getMonthValue()
                            && reportValue.getYear() == order.getCreatedAt().getYear())
                    .findFirst()
                    .ifPresent(reportValue -> reportValue.setValue(reportValue.getValue() + 1));
        }

        return reportValueList;
    }

    @Override
    public List<ReportValue> getCancellationRateByMonth(Date startDate, Date endDate) {
        LocalDateTime startDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime endDateTime = endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        endDateTime = endDateTime.plusDays(1);

        List<Order> orderList = orderRepository.findAllByCreatedAtBetween(startDateTime, endDateTime);

        List<ReportValue> reportValueList = initReportValueList(startDateTime, endDateTime);

        for (ReportValue reportValue : reportValueList) {
            int totalOrder = 0;
            int totalCancelled = 0;
            for (Order order : orderList) {
                if (order.getCreatedAt().getMonthValue() == reportValue.getMonth()
                        && order.getCreatedAt().getYear() == reportValue.getYear()) {
                    totalOrder++;
                    if (order.getStatus().equals("CANCELLED")) {
                        totalCancelled++;
                    }
                }
            }
            if (totalOrder != 0) {
                reportValue.setValue((double) totalCancelled / totalOrder);
            }
        }

        return reportValueList;
    }

    @Override
    public List<ReportValue> getRevenueByMonth(Date startDate, Date endDate) {
        LocalDateTime startDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime endDateTime = endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        endDateTime = endDateTime.plusDays(1);

        List<Order> orderList = orderRepository.findAllByCreatedAtBetween(startDateTime, endDateTime);

        List<ReportValue> reportValueList = initReportValueList(startDateTime, endDateTime);

            for (ReportValue reportValue : reportValueList) {
            double totalRevenue = 0;
            for (Order order : orderList) {
                if (!order.getStatus().equals("DELIVERED")) continue;

                if (order.getCreatedAt().getMonthValue() == reportValue.getMonth()
                        && order.getCreatedAt().getYear() == reportValue.getYear()) {
                    totalRevenue += order.getTotal();
                }
            }
            reportValue.setValue(totalRevenue);
        }

        return reportValueList;
    }

    @Override
    public List<FoodReport> getTopFoodByRevenue(Date startDate, Date endDate) {
        LocalDateTime startDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime endDateTime = endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        endDateTime = endDateTime.plusDays(1);

        List<Order> orderList = orderRepository.findAllByCreatedAtBetween(startDateTime, endDateTime);

        List<FoodReport> foodReportList = initFoodReportList(startDateTime, endDateTime);

        for (FoodReport foodReport : foodReportList) {
            List<FoodReportValue> foodReportValues = new ArrayList<>();

            for (Order order : orderList) {
                if (!order.getStatus().equals("DELIVERED")) continue;

                if (order.getCreatedAt().getMonthValue() == foodReport.getMonth()
                        && order.getCreatedAt().getYear() == foodReport.getYear()) {
                    for (Cart cart : order.getItems()) {
                        if (foodReportValues.stream().anyMatch(foodReportValue -> foodReportValue.getFood().getId() == cart.getFood().getId())) {
                            FoodReportValue foodReportValue = foodReportValues.stream()
                                    .filter(value -> value.getFood().getId() == cart.getFood().getId())
                                    .findFirst()
                                    .get();
                            foodReportValue.setRevenue(foodReportValue.getRevenue() + cart.getPrice());
                            foodReportValue.setQuantity(foodReportValue.getQuantity() + cart.getQuantity());
                        } else {
                            foodReportValues.add(FoodReportValue.builder()
                                    .food(FoodMapper.toFoodDTO(cart.getFood()))
                                    .quantity(cart.getQuantity())
                                    .revenue(cart.getPrice())
                                    .build());
                        }
                    }
                }
            }

            foodReportValues.sort((o1, o2) -> (int) (o2.getRevenue() - o1.getRevenue()));

            for (int i = 0; i < foodReportValues.size() && i < 5; i++) {
                foodReport.getValues().add(foodReportValues.get(i));
            }
        }

        return foodReportList;
    }

    @Override
    public List<FoodReport> getTopFoodByOrder(Date startDate, Date endDate) {
        LocalDateTime startDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime endDateTime = endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        endDateTime = endDateTime.plusDays(1);

        List<Order> orderList = orderRepository.findAllByCreatedAtBetween(startDateTime, endDateTime);

        List<FoodReport> foodReportList = initFoodReportList(startDateTime, endDateTime);

        for (FoodReport foodReport : foodReportList) {
            List<FoodReportValue> foodReportValues = new ArrayList<>();

            for (Order order : orderList) {
                if (!order.getStatus().equals("DELIVERED")) continue;

                if (order.getCreatedAt().getMonthValue() == foodReport.getMonth()
                        && order.getCreatedAt().getYear() == foodReport.getYear()) {
                    for (Cart cart : order.getItems()) {
                        if (foodReportValues.stream().anyMatch(foodReportValue -> foodReportValue.getFood().getId() == cart.getFood().getId())) {
                            FoodReportValue foodReportValue = foodReportValues.stream()
                                    .filter(value -> value.getFood().getId() == cart.getFood().getId())
                                    .findFirst()
                                    .get();
                            foodReportValue.setRevenue(foodReportValue.getRevenue() + cart.getPrice());
                            foodReportValue.setQuantity(foodReportValue.getQuantity() + cart.getQuantity());
                        } else {
                            foodReportValues.add(FoodReportValue.builder()
                                    .food(FoodMapper.toFoodDTO(cart.getFood()))
                                    .quantity(cart.getQuantity())
                                    .revenue(cart.getPrice())
                                    .build());
                        }
                    }
                }
            }

            foodReportValues.sort((o1, o2) -> (int) (o2.getQuantity() - o1.getQuantity()));

            for (int i = 0; i < foodReportValues.size() && i < 5; i++) {
                foodReport.getValues().add(foodReportValues.get(i));
            }
        }

        return foodReportList;
    }

    @Override
    public List<ReportValue> getCustomerTransaction(Date startDate, Date endDate) {
        LocalDateTime startDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime endDateTime = endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        endDateTime = endDateTime.plusDays(1);

        List<Order> orderList = orderRepository.findAllByCreatedAtBetween(startDateTime, endDateTime);

        List<ReportValue> reportValueList = initReportValueList(startDateTime, endDateTime);

        for (ReportValue reportValue : reportValueList) {
            Set<Integer> customerSet = new HashSet<>();

            for (Order order : orderList) {
                if (!order.getStatus().equals("DELIVERED")) continue;

                if (order.getCreatedAt().getMonthValue() == reportValue.getMonth()
                        && order.getCreatedAt().getYear() == reportValue.getYear()) {
                    customerSet.add(order.getUser().getId());
                }
            }
            reportValue.setValue(customerSet.size());
        }

        return reportValueList;
    }

    private List<ReportValue> initReportValueList(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        List<ReportValue> reportValueList = new ArrayList<>();
        if (startDateTime.getYear() == endDateTime.getYear()) {
            for (int month = startDateTime.getMonthValue(); month <= endDateTime.getMonthValue(); month++) {
                reportValueList.add(ReportValue.builder()
                        .month(month)
                        .year(startDateTime.getYear())
                        .value(0)
                        .build());
            }
        } else {
            for (int month = startDateTime.getMonthValue(); month <= 12; month++) {
                reportValueList.add(ReportValue.builder()
                        .month(month)
                        .year(startDateTime.getYear())
                        .value(0)
                        .build());
            }

            for (int year = startDateTime.getYear() + 1; year < endDateTime.getYear(); year++) {
                for (int month = 1; month <= 12; month++) {
                    reportValueList.add(ReportValue.builder()
                            .month(month)
                            .year(year)
                            .value(0)
                            .build());
                }
            }

            for (int month = 1; month <= endDateTime.getMonthValue(); month++) {
                reportValueList.add(ReportValue.builder()
                        .month(month)
                        .year(endDateTime.getYear())
                        .value(0)
                        .build());
            }
        }
        return reportValueList;
    }

    private List<FoodReport> initFoodReportList(LocalDateTime startDateTime, LocalDateTime endDateTime ) {
        List<FoodReport> foodReportList = new ArrayList<>();

        if (startDateTime.getYear() == endDateTime.getYear()) {
            for (int month = startDateTime.getMonthValue(); month <= endDateTime.getMonthValue(); month++) {
                foodReportList.add(FoodReport.builder()
                        .month(month)
                        .year(startDateTime.getYear())
                        .values(new ArrayList<>())
                        .build());
            }
        } else {
            for (int month = startDateTime.getMonthValue(); month <= 12; month++) {
                foodReportList.add(FoodReport.builder()
                        .month(month)
                        .year(startDateTime.getYear())
                        .values(new ArrayList<>())
                        .build());
            }

            for (int year = startDateTime.getYear() + 1; year < endDateTime.getYear(); year++) {
                for (int month = 1; month <= 12; month++) {
                    foodReportList.add(FoodReport.builder()
                            .month(month)
                            .year(year)
                            .values(new ArrayList<>())
                            .build());
                }
            }

            for (int month = 1; month <= endDateTime.getMonthValue(); month++) {
                foodReportList.add(FoodReport.builder()
                        .month(month)
                        .year(endDateTime.getYear())
                        .values(new ArrayList<>())
                        .build());
            }
        }

        return foodReportList;
    }
}
