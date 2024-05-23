package com.springboot.fstore.service;

import com.springboot.fstore.payload.FeedbackDTO;
import com.springboot.fstore.payload.OrderDTO;

import java.util.List;

public interface OrderService {
    OrderDTO makeOrder(OrderDTO orderDTO);

    OrderDTO updateOrder(int orderId, OrderDTO orderDTO);

    List<OrderDTO> getOrders();

    OrderDTO feedback(int orderId, FeedbackDTO feedBackDTO);
}
