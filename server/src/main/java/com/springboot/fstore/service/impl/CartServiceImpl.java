package com.springboot.fstore.service.impl;

import com.springboot.fstore.entity.Cart;
import com.springboot.fstore.entity.Food;
import com.springboot.fstore.entity.FoodSize;
import com.springboot.fstore.entity.User;
import com.springboot.fstore.exception.CustomException;
import com.springboot.fstore.mapper.CartMapper;
import com.springboot.fstore.payload.CartDTO;
import com.springboot.fstore.repository.CartRepository;
import com.springboot.fstore.repository.FoodRepository;
import com.springboot.fstore.repository.FoodSizeRepository;
import com.springboot.fstore.service.CartService;
import com.springboot.fstore.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final UserService userService;
    private final FoodRepository foodRepository;
    private final FoodSizeRepository foodSizeRepository;
    @Override
    public List<CartDTO> getCart() {
        User user = userService.getAuthorizedUser();
        List<Cart> cartList = cartRepository.findByUserId(user.getId());
        return cartList.stream().map(CartMapper::toCartDTO).toList();
    }

    @Override
    public void addCart(CartDTO cartDTO) {
        User user = userService.getAuthorizedUser();
        Cart cart = CartMapper.toCart(cartDTO);
        cart.setUser(user);

        if (cartDTO.getFood() != null) {
            Food food = foodRepository.findById(cartDTO.getFood().getId())
                    .orElseThrow(() -> new CustomException("Food not found", HttpStatus.NOT_FOUND));
            cart.setFood(food);
        }
        if (cartDTO.getFoodSize() != null) {
            FoodSize foodSize = foodSizeRepository.findById(cartDTO.getFoodSize().getId())
                    .orElseThrow(() -> new CustomException("Food size not found", HttpStatus.NOT_FOUND));
            cart.setFoodSize(foodSize);
        }

        cartRepository.save(cart);
    }


    @Override
    public void deleteCart(int cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CustomException("Cart not found", HttpStatus.NOT_FOUND));
        cartRepository.delete(cart);
    }
}
