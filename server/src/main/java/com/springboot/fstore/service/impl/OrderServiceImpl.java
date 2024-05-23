package com.springboot.fstore.service.impl;

import com.springboot.fstore.entity.*;
import com.springboot.fstore.exception.CustomException;
import com.springboot.fstore.mapper.OrderMapper;
import com.springboot.fstore.payload.CartDTO;
import com.springboot.fstore.payload.OrderDTO;
import com.springboot.fstore.repository.CartRepository;
import com.springboot.fstore.repository.FoodRepository;
import com.springboot.fstore.repository.FoodSizeRepository;
import com.springboot.fstore.repository.OrderRepository;
import com.springboot.fstore.service.OrderService;
import com.springboot.fstore.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final UserService userService;
    private final OrderRepository orderRepository;
    private final FoodRepository foodRepository;
    private final FoodSizeRepository foodSizeRepository;
    private final CartRepository cartRepository;

    @Override
    public OrderDTO makeOrder(OrderDTO orderDTO) {
        User user = userService.getAuthorizedUser();
        Order order = OrderMapper.toOrder(orderDTO);
        order.setUser(user);
        order.setItems(new ArrayList<>());

        if (orderDTO.getItems() != null) {
            for (CartDTO item : orderDTO.getItems()) {
                Cart cart = cartRepository.findById(item.getId()).orElseThrow(() -> new CustomException("Cart not found", HttpStatus.NOT_FOUND));
                cart.setOrdered(true);
                cart.setOrder(order);
                order.getItems().add(cart);
                order.setTotal(order.getTotal());
            }
        }
        orderRepository.save(order);
        return OrderMapper.toOrderDTO(order);
    }

    @Override
    public OrderDTO updateOrder(int orderId, OrderDTO orderDTO) {
        User user = userService.getAuthorizedUser();
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new CustomException("Order not found", HttpStatus.NOT_FOUND));
        if (order.getUser().getId() != user.getId()) {
            throw new CustomException("You are not authorized to update this order", HttpStatus.UNAUTHORIZED);
        }
        order.setStatus(orderDTO.getStatus());
        order.setNote(orderDTO.getNote());
        orderRepository.save(order);
        return OrderMapper.toOrderDTO(order);
    }

    @Override
    public List<OrderDTO> getOrders() {
        User user = userService.getAuthorizedUser();
        List<Order> orders = orderRepository.findAllByUserId(user.getId());
        return orders.stream().map(OrderMapper::toOrderDTO).toList();
    }
}

