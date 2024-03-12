package com.springboot.fstore.payload;

import com.springboot.fstore.entity.FoodSize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FoodDTO {
    private int id;
    private String name;
    private String description;
    private String image;
    private Double price;
    private int quantity;
    private String category;
    private Boolean isDeleted;
    private LocalDateTime createdAt;
//    private List<String> foodSizes;
}
