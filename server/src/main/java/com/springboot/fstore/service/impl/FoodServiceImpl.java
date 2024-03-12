package com.springboot.fstore.service.impl;

import com.springboot.fstore.entity.Food;
import com.springboot.fstore.exception.CustomException;
import com.springboot.fstore.exception.ResourceNotFoundException;
import com.springboot.fstore.mapper.FoodMapper;
import com.springboot.fstore.payload.FoodDTO;
import com.springboot.fstore.repository.FoodRepository;
import com.springboot.fstore.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodServiceImpl implements FoodService {
    private final FoodRepository foodRepository;
    @Override
    public FoodDTO createFood(FoodDTO foodDTO) {
        Food food = FoodMapper.toFood(foodDTO);
        Food newFood = foodRepository.save(food);

        return FoodMapper.toFoodDTO(newFood);
    }

    @Override
    public FoodDTO updateFood(FoodDTO foodDTO, int foodId) {
        Food food = foodRepository.findById(foodId).orElseThrow(() -> new CustomException("Food not found", HttpStatus.NOT_FOUND));
        food.setName(foodDTO.getName());
        food.setDescription(foodDTO.getDescription());
        food.setImage(foodDTO.getImage());
        food.setPrice(foodDTO.getPrice());
        food.setQuantity(foodDTO.getQuantity());
        food.setCategory(foodDTO.getCategory());
        return FoodMapper.toFoodDTO(foodRepository.save(food));
    }

    @Override
    public FoodDTO getFood(int id) {
        Food food = foodRepository.findById(id).orElseThrow(() -> new CustomException("Food not found", HttpStatus.NOT_FOUND));
        return FoodMapper.toFoodDTO(food);
    }

    @Override
    public void deleteFood(int id) {
        Food food = foodRepository.findById(id).orElseThrow(() -> new CustomException("Food not found", HttpStatus.NOT_FOUND));
        food.setIsDeleted(true);
        foodRepository.save(food);
    }

    @Override
    public List<FoodDTO> getFoods() {
        List<Food> foods = foodRepository.findAll();
        return foods.stream().map(FoodMapper::toFoodDTO).toList();
    }
}
