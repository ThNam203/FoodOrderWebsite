package com.springboot.fstore.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDetailDTO {
    private int id;
    private int quantity;
    private Double price;
    private FoodDTO food;
    private FoodSizeDTO foodSize;
    private LocalDateTime createdAt;
}