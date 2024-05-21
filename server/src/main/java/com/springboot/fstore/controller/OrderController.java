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
    public ResponseEntity<OrderDTO> makeOrder(@RequestBody OrderDTO orderDTO) {
        return ResponseEntity.ok(orderService.makeOrder(orderDTO));
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getOrders() {
        return ResponseEntity.ok(orderService.getOrders());
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable int orderId, @RequestBody OrderDTO orderDTO) {
        return ResponseEntity.ok(orderService.updateOrder(orderId, orderDTO));
    }
}
