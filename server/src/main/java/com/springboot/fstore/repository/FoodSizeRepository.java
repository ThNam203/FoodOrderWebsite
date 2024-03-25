package com.springboot.fstore.repository;

import com.springboot.fstore.entity.FoodSize;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodSizeRepository extends JpaRepository<FoodSize, Integer> {
}
