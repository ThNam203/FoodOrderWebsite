package com.springboot.fstore.service.impl;

import com.springboot.fstore.entity.*;
import com.springboot.fstore.exception.CustomException;
import com.springboot.fstore.mapper.OrderDetailMapper;
import com.springboot.fstore.mapper.OrderMapper;
import com.springboot.fstore.payload.OrderDTO;
import com.springboot.fstore.payload.OrderDetailDTO;
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
    @Override
    public void makeOrder(OrderDTO orderDTO) {
        User user = userService.getAuthorizedUser();
        Order order = OrderMapper.toOrder(orderDTO);
        order.setUser(user);
        order.setOrderDetails(new ArrayList<>());

        if (orderDTO.getOrderDetails() != null) {
            for (OrderDetailDTO orderDetailDTO : orderDTO.getOrderDetails()) {
                OrderDetail orderDetail = OrderDetailMapper.toOrderDetail(orderDetailDTO);
                if (orderDetailDTO.getFood() != null) {
                    Food food = foodRepository.findById(orderDetailDTO.getFood().getId()).orElseThrow(() -> new CustomException("Food not found", HttpStatus.NOT_FOUND));
                    orderDetail.setFood(food);
                }
                if (orderDetailDTO.getFoodSize() != null) {
                    FoodSize foodSize = foodSizeRepository.findById(orderDetailDTO.getFoodSize().getId()).orElseThrow(() -> new CustomException("Food size not found", HttpStatus.NOT_FOUND));
                    orderDetail.setFoodSize(foodSize);
                }
                orderDetail.setOrder(order);
                order.getOrderDetails().add(orderDetail);
            }
        }
        orderRepository.save(order);
    }

    @Override
    public void updateOrder(int orderId, OrderDTO orderDTO) {
        User user = userService.getAuthorizedUser();
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new CustomException("Order not found", HttpStatus.NOT_FOUND));
        if (order.getUser().getId() != user.getId()) {
            throw new CustomException("You are not authorized to update this order", HttpStatus.UNAUTHORIZED);
        }
        order.setTotal(orderDTO.getTotal());
        order.setStatus(orderDTO.getStatus());
        order.setStatus(orderDTO.getStatus());
        if (orderDTO.getOrderDetails() != null) {
            order.getOrderDetails().clear();
            for (OrderDetailDTO orderDetailDTO : orderDTO.getOrderDetails()) {
                OrderDetail orderDetail = OrderDetailMapper.toOrderDetail(orderDetailDTO);
                if (orderDetailDTO.getFood() != null) {
                    Food food = foodRepository.findById(orderDetailDTO.getFood().getId()).orElseThrow(() -> new CustomException("Food not found", HttpStatus.NOT_FOUND));
                    orderDetail.setFood(food);
                }
                if (orderDetailDTO.getFoodSize() != null) {
                    FoodSize foodSize = foodSizeRepository.findById(orderDetailDTO.getFoodSize().getId()).orElseThrow(() -> new CustomException("Food size not found", HttpStatus.NOT_FOUND));
                    orderDetail.setFoodSize(foodSize);
                }
                orderDetail.setOrder(order);
                order.getOrderDetails().add(orderDetail);
            }
        }
        orderRepository.save(order);
    }

    @Override
    public List<OrderDTO> getOrders() {
        User user = userService.getAuthorizedUser();
        List<Order> orders = orderRepository.findAllByUserId(user.getId());
        return orders.stream().map(OrderMapper::toOrderDTO).toList();
    }
}

