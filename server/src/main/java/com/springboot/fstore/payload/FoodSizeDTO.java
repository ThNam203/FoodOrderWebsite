package com.springboot.fstore.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FoodSizeDTO {
    private int id;
    private String name;
    private Double price;
    private Double weight;
    private String note;
    private boolean deleted;
}
