package com.springboot.fstore.controller;

import com.springboot.fstore.payload.FoodDTO;
import com.springboot.fstore.service.FoodFavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/food-favorite")
public class FoodFavoriteController {
    private final FoodFavoriteService foodFavoriteService;

    @Operation(summary = "Get food favorite")
    @GetMapping
    public ResponseEntity<List<FoodDTO>> getFoodFavorite() {
        return ResponseEntity.ok(foodFavoriteService.getFoodFavorite());
    }

    @Operation(summary = "Add food favorite")
    @PostMapping("/{foodId}")
    public ResponseEntity<?> addFoodFavorite(@PathVariable int foodId) {
        foodFavoriteService.addFoodFavorite(foodId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Remove food favorite")
    @DeleteMapping("/{foodId}")
    public ResponseEntity<?> removeFoodFavorite(@PathVariable int foodId) {
        foodFavoriteService.removeFoodFavorite(foodId);
        return ResponseEntity.ok().build();
    }
}