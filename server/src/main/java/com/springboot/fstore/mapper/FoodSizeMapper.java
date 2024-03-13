package com.springboot.fstore.mapper;

import com.springboot.fstore.entity.FoodSize;
import com.springboot.fstore.payload.FoodSizeDTO;

public class FoodSizeMapper {
    public static FoodSizeDTO toFoodSizeDTO(FoodSize foodSize) {
        return FoodSizeDTO.builder()
                .id(foodSize.getId())
                .name(foodSize.getName())
                .price(foodSize.getPrice())
                .weight(foodSize.getWeight())
                .note(foodSize.getNote())
                .quantity(foodSize.getQuantity())
                .build();
    }

    public static FoodSize toFoodSize(FoodSizeDTO foodSizeDTO) {
        return FoodSize.builder()
                .name(foodSizeDTO.getName())
                .price(foodSizeDTO.getPrice())
                .weight(foodSizeDTO.getWeight())
                .note(foodSizeDTO.getNote())
                .quantity(foodSizeDTO.getQuantity())
                .build();
    }
}
