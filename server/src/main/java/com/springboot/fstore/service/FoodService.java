package com.springboot.fstore.service;

import com.springboot.fstore.payload.FoodDTO;

import java.util.List;

public interface FoodService {
    FoodDTO createFood(FoodDTO foodDTO);
    FoodDTO updateFood(FoodDTO foodDTO, int foodId);
    FoodDTO getFood(int id);
    void deleteFood(int id);
    List<FoodDTO> getFoods();
}
