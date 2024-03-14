package com.springboot.fstore.controller;

import com.springboot.fstore.payload.CategoryDTO;
import com.springboot.fstore.service.CategoryService;
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

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable int id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@RequestPart(value = "files", required = false) MultipartFile[] files,
                                                      @RequestPart("data") CategoryDTO categoryDTO) {
        return ResponseEntity.status(201).body(categoryService.createCategory(files, categoryDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable int id,
                                                      @RequestPart(value = "files", required = false) MultipartFile[] files,
                                                      @RequestPart("data") CategoryDTO categoryDTO) {
        return ResponseEntity.ok(categoryService.updateCategory(id, files, categoryDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable int id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}
