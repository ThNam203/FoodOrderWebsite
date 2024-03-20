package com.springboot.fstore.service.impl;

import com.springboot.fstore.entity.Category;
import com.springboot.fstore.entity.Food;
import com.springboot.fstore.entity.FoodSize;
import com.springboot.fstore.exception.CustomException;
import com.springboot.fstore.exception.ResourceNotFoundException;
import com.springboot.fstore.mapper.FoodMapper;
import com.springboot.fstore.mapper.FoodSizeMapper;
import com.springboot.fstore.payload.FoodDTO;
import com.springboot.fstore.repository.CategoryRepository;
import com.springboot.fstore.repository.FoodRepository;
import com.springboot.fstore.service.FileService;
import com.springboot.fstore.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodServiceImpl implements FoodService {
    private final FoodRepository foodRepository;
    private final CategoryRepository categoryRepository;
    private final FileService fileService;
    @Override
    public FoodDTO createFood(MultipartFile[] files, FoodDTO foodDTO) {
        Food food = FoodMapper.toFood(foodDTO);

        if (files != null) {
            String url = fileService.uploadFile(files[0]);
            food.setImage(url);
        }

        if (foodDTO.getCategory() != null) {
            Category category = categoryRepository.findById(foodDTO.getCategory().getId()).orElseThrow(() -> new CustomException("Category not found", HttpStatus.NOT_FOUND));
            food.setCategory(category);
        }

        if (foodDTO.getFoodSizes() != null) {
            food.setFoodSizes(foodDTO.getFoodSizes()
                    .stream()
                    .map(foodSizeDTO -> {
                        FoodSize foodSize = FoodSizeMapper.toFoodSize(foodSizeDTO);
                        foodSize.setFood(food);
                        return foodSize;
                    })
                    .toList());
        }

        Food newFood = foodRepository.save(food);

        return FoodMapper.toFoodDTO(newFood);
    }

    @Override
    public FoodDTO updateFood(int foodId, MultipartFile[] files, FoodDTO foodDTO) {
        Food food = foodRepository.findById(foodId).orElseThrow(() -> new CustomException("Food not found", HttpStatus.NOT_FOUND));
        food.setName(foodDTO.getName());
        food.setDescription(foodDTO.getDescription());

        if (files != null) {
            String url = fileService.uploadFile(files[0]);
            food.setImage(url);
        }

        if (foodDTO.getCategory() == null)
            food.setCategory(null);
        else {
            if (food.getCategory() == null || foodDTO.getCategory().getId() != food.getCategory().getId()) {
                Category category = categoryRepository.findById(foodDTO.getCategory().getId()).orElseThrow(() -> new CustomException("Category not found", HttpStatus.NOT_FOUND));
                food.setCategory(category);
            }
        }

        if (foodDTO.getFoodSizes() != null) {
            food.getFoodSizes().clear();
            food.getFoodSizes().addAll(foodDTO.getFoodSizes()
                    .stream()
                    .map(foodSizeDTO -> {
                        FoodSize foodSize = FoodSizeMapper.toFoodSize(foodSizeDTO);
                        foodSize.setFood(food);
                        return foodSize;
                    })
                    .toList());
        }
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
