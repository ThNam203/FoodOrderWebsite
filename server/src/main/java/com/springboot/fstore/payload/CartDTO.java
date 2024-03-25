package com.springboot.fstore.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartDTO {
    private int id;
    private int quantity;
    private FoodDTO food;
    private FoodSizeDTO foodSize;
}
