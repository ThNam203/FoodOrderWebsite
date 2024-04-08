package com.springboot.fstore.mapper;

import com.springboot.fstore.entity.FoodRatting;
import com.springboot.fstore.payload.FoodRattingDTO;

public class FoodRattingMapper {
    public static FoodRatting toFoodRatting(FoodRattingDTO foodRattingDTO) {
        return FoodRatting.builder()
                .rate(foodRattingDTO.getRate())
                .comment(foodRattingDTO.getComment())
                .build();
    }
    public static FoodRattingDTO toFoodRattingDTO(FoodRatting foodRatting) {
        return FoodRattingDTO.builder()
                .rate(foodRatting.getRate())
                .comment(foodRatting.getComment())
                .user(foodRatting.getUser() != null ? UserMapper.toUserDTO(foodRatting.getUser()) : null)
                .build();
    }
}
