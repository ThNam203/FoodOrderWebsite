package com.springboot.fstore.service;

import com.springboot.fstore.payload.CategoryDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryService {
    List<CategoryDTO> getAllCategories();
    CategoryDTO getCategoryById(int id);
    CategoryDTO createCategory(MultipartFile[] files, CategoryDTO categoryDTO);
    CategoryDTO updateCategory(int id, MultipartFile[] files, CategoryDTO categoryDTO);
    void deleteCategory(int id);
}
