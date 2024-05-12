package com.springboot.fstore.service;

import com.springboot.fstore.payload.CartDTO;

import java.util.List;

public interface CartService {
    List<CartDTO> getCart();

    CartDTO addCart(CartDTO cartDTO);

    void deleteCart(int cartId);
}
