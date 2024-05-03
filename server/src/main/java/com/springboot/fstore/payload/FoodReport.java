package com.springboot.fstore.payload;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FoodReport {
    private int foodId;
    private int quantity;
    private double totalSales;
}
