package com.springboot.fstore.controller;

import com.springboot.fstore.payload.CartDTO;
import com.springboot.fstore.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartDTO>> getAllCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @PostMapping
    public ResponseEntity<CartDTO> addCart(@RequestBody CartDTO cartDTO) {
        return ResponseEntity.ok(cartService.addCart(cartDTO));
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<?> deleteCart(@PathVariable int cartId) {
        cartService.deleteCart(cartId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{cartId}")
    public ResponseEntity<?> updateCart(@PathVariable int cartId, @RequestBody CartDTO cartDTO) {
        cartService.updateCart(cartId, cartDTO);
        return ResponseEntity.ok().build();
    }
}
