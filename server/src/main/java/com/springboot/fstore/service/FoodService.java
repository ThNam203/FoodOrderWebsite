package com.springboot.fstore.service;

import com.springboot.fstore.payload.FoodDTO;
import com.springboot.fstore.payload.FoodRattingDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FoodService {
    FoodDTO createFood(MultipartFile[] files, FoodDTO foodDTO);

    FoodDTO updateFood(int foodId, MultipartFile[] files, FoodDTO foodDTO);

    FoodDTO getFood(int id);

    void deleteFood(int id);

    List<FoodDTO> getFoods();

    void rateFood(int foodId, FoodRattingDTO foodRattingDTO);
}
