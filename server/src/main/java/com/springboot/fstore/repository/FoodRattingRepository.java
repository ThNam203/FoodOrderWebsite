package com.springboot.fstore.repository;

import com.springboot.fstore.entity.FoodRatting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FoodRattingRepository extends JpaRepository<FoodRatting, Integer>{
    Optional<FoodRatting> findByFoodIdAndUserId(int foodId, int userId);
}
