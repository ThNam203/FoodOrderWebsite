package com.springboot.fstore.controller;

import com.springboot.fstore.payload.OrderDTO;
import com.springboot.fstore.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> makeOrder(@RequestBody OrderDTO orderDTO) {
        orderService.makeOrder(orderDTO);
        return ResponseEntity.ok().build();
    }
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getOrders() {
        return ResponseEntity.ok(orderService.getOrders());
    }
}
