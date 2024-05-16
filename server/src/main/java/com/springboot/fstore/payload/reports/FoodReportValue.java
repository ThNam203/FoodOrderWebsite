package com.springboot.fstore.payload.reports;

import com.springboot.fstore.entity.Food;
import com.springboot.fstore.payload.FoodDTO;
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
    private FoodDTO food;
}
