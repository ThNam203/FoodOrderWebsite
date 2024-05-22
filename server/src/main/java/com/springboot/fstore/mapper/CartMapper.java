package com.springboot.fstore.mapper;

import com.springboot.fstore.entity.Cart;
import com.springboot.fstore.payload.CartDTO;

public class CartMapper {
    public static CartDTO toCartDTO(Cart cart) {
        if (cart == null) return null;
        return CartDTO.builder()
                .id(cart.getId())
                .quantity(cart.getQuantity())
                .price(cart.getPrice())
                .food(cart.getFood() != null ? FoodMapper.toFoodDTO(cart.getFood()) : null)
                .foodSize(cart.getFoodSize() != null ? FoodSizeMapper.toFoodSizeDTO(cart.getFoodSize()) : null)
                .note(cart.getNote() != null ? cart.getNote() : "")
                .build();
    }

    public static Cart toCart(CartDTO cartDTO) {
        if (cartDTO == null) return null;
        return Cart.builder()
                .quantity(cartDTO.getQuantity())
                .note(cartDTO.getNote())
                .build();
    }
}
