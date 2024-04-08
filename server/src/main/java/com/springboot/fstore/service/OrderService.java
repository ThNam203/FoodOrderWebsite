package com.springboot.fstore.service;

import com.springboot.fstore.payload.OrderDTO;

import java.util.List;

public interface OrderService {
    void makeOrder(OrderDTO orderDTO);
    void updateOrder(int orderId, OrderDTO orderDTO);
    List<OrderDTO> getOrders();
}
