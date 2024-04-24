package com.springboot.fstore.service.impl;

import com.springboot.fstore.entity.Food;
import com.springboot.fstore.entity.User;
import com.springboot.fstore.exception.CustomException;
import com.springboot.fstore.mapper.FoodMapper;
import com.springboot.fstore.payload.FoodDTO;
import com.springboot.fstore.repository.FoodRepository;
import com.springboot.fstore.repository.UserRepository;
import com.springboot.fstore.service.FoodFavoriteService;
import com.springboot.fstore.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodFavoriteServiceImpl implements FoodFavoriteService {
    private final UserRepository userRepository;
    private final FoodRepository foodRepository;
    private final UserService userService;
    @Override
    public List<FoodDTO> getFoodFavorite() {
        User user = userService.getAuthorizedUser();
        return user.getFavouriteFoods().stream().map(FoodMapper::toFoodDTO).toList();
    }

    @Override
    public void addFoodFavorite(int foodId) {
        Food food = foodRepository.findById(foodId).orElseThrow(() -> new CustomException("Food not found", HttpStatus.NOT_FOUND));
        User user = userService.getAuthorizedUser();
        if (user.getFavouriteFoods().contains(food)) {
            user.getFavouriteFoods().remove(food);
        } else {
            user.getFavouriteFoods().add(food);
        }
        userRepository.save(user);
    }

    @Override
    public void removeFoodFavorite(int foodId) {
        Food food = foodRepository.findById(foodId).orElseThrow(() -> new CustomException("Food not found", HttpStatus.NOT_FOUND));
        User user = userService.getAuthorizedUser();
        if (!user.getFavouriteFoods().contains(food)) {
            throw new CustomException("Food not in favorite list", HttpStatus.BAD_REQUEST);
        }
        user.getFavouriteFoods().remove(food);
        userRepository.save(user);
    }
}
