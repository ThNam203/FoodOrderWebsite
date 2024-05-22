package com.springboot.fstore.controller;

import com.springboot.fstore.payload.FeedbackDTO;
import com.springboot.fstore.payload.OrderDTO;
import com.springboot.fstore.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/orders")
    public ResponseEntity<OrderDTO> makeOrder(@RequestBody OrderDTO orderDTO) {
        return ResponseEntity.ok(orderService.makeOrder(orderDTO));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getOrders() {
        return ResponseEntity.ok(orderService.getOrders());
    }

    @PutMapping("/orders/{orderId}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable int orderId, @RequestBody OrderDTO orderDTO) {
        return ResponseEntity.ok(orderService.updateOrder(orderId, orderDTO));
    }

    @PostMapping("/orders/{orderId}/feedback")
    public ResponseEntity<OrderDTO> feedback(@PathVariable int orderId, @RequestBody FeedbackDTO feedbackDTO) {
        return ResponseEntity.ok(orderService.feedback(orderId, feedbackDTO));
    }
}
