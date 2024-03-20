package com.springboot.fstore.controller;

import com.springboot.fstore.payload.CategoryDTO;
import com.springboot.fstore.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @Operation(summary = "Get all categories")
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @Operation(summary = "Get category by id")
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable int id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @Operation(summary = "Create category")
    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@RequestPart(value = "files", required = false) MultipartFile[] files,
                                                      @RequestPart("data") CategoryDTO categoryDTO) {
        return ResponseEntity.status(201).body(categoryService.createCategory(files, categoryDTO));
    }

    @Operation(summary = "Update category")
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable int id,
                                                      @RequestPart(value = "files", required = false) MultipartFile[] files,
                                                      @RequestPart("data") CategoryDTO categoryDTO) {
        return ResponseEntity.ok(categoryService.updateCategory(id, files, categoryDTO));
    }

    @Operation(summary = "Delete category")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable int id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}
