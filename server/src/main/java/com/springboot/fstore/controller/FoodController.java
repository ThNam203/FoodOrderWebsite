package com.springboot.fstore.controller;

import com.springboot.fstore.payload.FoodDTO;
import com.springboot.fstore.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/foods")
public class FoodController {
    private final FoodService foodService;

    @GetMapping
    public ResponseEntity<List<FoodDTO>> getFoods() {
        return ResponseEntity.ok(foodService.getFoods());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodDTO> getFood(@PathVariable int id) {
        return ResponseEntity.ok(foodService.getFood(id));
    }

    @PostMapping
    public ResponseEntity<FoodDTO> createFood(@RequestBody FoodDTO foodDTO) {
        return ResponseEntity.status(201).body(foodService.createFood(foodDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodDTO> updateFood(@RequestBody FoodDTO foodDTO, @PathVariable int id) {
        return ResponseEntity.ok(foodService.updateFood(foodDTO, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable int id) {
        foodService.deleteFood(id);
        return ResponseEntity.noContent().build();
    }
}
