package com.springboot.fstore.controller;

import com.springboot.fstore.payload.FoodDTO;
import com.springboot.fstore.service.FoodService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/foods")
public class FoodController {
    private final FoodService foodService;

    @Operation(summary = "Get all foods")
    @GetMapping
    public ResponseEntity<List<FoodDTO>> getFoods() {
        return ResponseEntity.ok(foodService.getFoods());
    }

    @Operation(summary = "Get food by id")
    @GetMapping("/{id}")
    public ResponseEntity<FoodDTO> getFood(@PathVariable int id) {
        return ResponseEntity.ok(foodService.getFood(id));
    }

    @Operation(summary = "Create food")
    @PostMapping
    public ResponseEntity<FoodDTO> createFood(@RequestPart(value = "files", required = false) MultipartFile[] files,
                                              @RequestPart("data") FoodDTO foodDTO) {
        return ResponseEntity.status(201).body(foodService.createFood(files, foodDTO));
    }

    @Operation(summary = "Update food")
    @PutMapping("/{id}")
    public ResponseEntity<FoodDTO> updateFood(@PathVariable int id,
                                              @RequestPart(value = "files", required = false) MultipartFile[] files,
                                              @RequestPart("data") FoodDTO foodDTO) {
        return ResponseEntity.ok(foodService.updateFood(id, files, foodDTO));
    }

    @Operation(summary = "Delete food")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable int id) {
        foodService.deleteFood(id);
        return ResponseEntity.noContent().build();
    }
}