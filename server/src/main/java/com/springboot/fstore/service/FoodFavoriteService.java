package com.springboot.fstore.service;

import com.springboot.fstore.payload.FoodDTO;

import java.util.List;

public interface FoodFavoriteService {
    List<FoodDTO> getFoodFavorite();
    void addFoodFavorite(int foodId);
    void removeFoodFavorite(int foodId);
}
