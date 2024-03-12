package com.springboot.fstore.mapper;

import com.springboot.fstore.entity.Food;
import com.springboot.fstore.entity.FoodSize;
import com.springboot.fstore.payload.FoodDTO;

public class FoodMapper {
    public static FoodDTO toFoodDTO(Food food) {
        return FoodDTO.builder()
                .id(food.getId())
                .name(food.getName())
                .description(food.getDescription())
                .image(food.getImage())
                .price(food.getPrice())
                .quantity(food.getQuantity())
                .category(food.getCategory())
                .isDeleted(food.getIsDeleted())
                .createdAt(food.getCreatedAt())
//                .foodSizes(food.getFoodSizes().stream().map(FoodSize::getName).toList())
                .build();
    }
    public static Food toFood(FoodDTO foodDTO) {
        return Food.builder()
                .name(foodDTO.getName())
                .description(foodDTO.getDescription())
                .image(foodDTO.getImage())
                .price(foodDTO.getPrice())
                .quantity(foodDTO.getQuantity())
                .category(foodDTO.getCategory())
                .isDeleted(foodDTO.getIsDeleted() != null && foodDTO.getIsDeleted())
                .build();
    }
}
