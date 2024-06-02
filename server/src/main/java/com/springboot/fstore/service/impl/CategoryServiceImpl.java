package com.springboot.fstore.service.impl;

import com.springboot.fstore.entity.Category;
import com.springboot.fstore.exception.CustomException;
import com.springboot.fstore.mapper.CategoryMapper;
import com.springboot.fstore.payload.CategoryDTO;
import com.springboot.fstore.repository.CategoryRepository;
import com.springboot.fstore.service.CategoryService;
import com.springboot.fstore.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final FileService fileService;

    @Override
    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();

        return categories.stream()
                .map(CategoryMapper::toCategoryDTO)
                .toList();
    }

    @Override
    public CategoryDTO getCategoryById(int id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new CustomException("Category not found", HttpStatus.NOT_FOUND));
        return CategoryMapper.toCategoryDTO(category);
    }

    @Override
    public CategoryDTO createCategory(MultipartFile[] files, CategoryDTO categoryDTO) {
        if (categoryRepository.existsByName(categoryDTO.getName())) {
            throw new CustomException("Category already exists", HttpStatus.BAD_REQUEST);
        }
        Category category = CategoryMapper.toCategory(categoryDTO);
        if (files != null) {
            String url = fileService.uploadFile(files[0]);
            category.setImage(url);
        }
        Category newCategory = categoryRepository.save(category);
        return CategoryMapper.toCategoryDTO(newCategory);
    }

    @Override
    public CategoryDTO updateCategory(int id, MultipartFile[] files, CategoryDTO categoryDTO) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new CustomException("Category not found", HttpStatus.NOT_FOUND));
        category.setName(categoryDTO.getName());
        category.setImage(categoryDTO.getImage());
        if (files != null) {
            String url = fileService.uploadFile(files[0]);
            category.setImage(url);
        }
        return CategoryMapper.toCategoryDTO(categoryRepository.save(category));
    }

    @Override
    public void deleteCategory(int id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new CustomException("Category not found", HttpStatus.NOT_FOUND));
        categoryRepository.delete(category);
    }
}
