package com.springboot.fstore.payload.reports;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FoodReport {
    private int month;
    private int year;
    private List<FoodReportValue> values;
}
