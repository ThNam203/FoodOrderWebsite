package com.springboot.fstore.payload.reports;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FoodReportValue {
    private double revenue;
    private int quantity;
    private int foodId;
    private String foodName;
    private String foodImage;
}
