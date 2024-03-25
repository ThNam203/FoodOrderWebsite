package com.springboot.fstore.mapper;

import com.springboot.fstore.entity.Category;
import com.springboot.fstore.payload.CategoryDTO;

public class CategoryMapper {
    public static CategoryDTO toCategoryDTO(Category category) {
        if (category == null) return null;
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .image(category.getImage())
                .build();
    }

    public static Category toCategory(CategoryDTO categoryDTO) {
        if (categoryDTO == null) return null;
        return Category.builder()
                .name(categoryDTO.getName())
                .image(categoryDTO.getImage())
                .build();
    }
}
