package com.springboot.fstore.mapper;

import com.springboot.fstore.entity.Order;
import com.springboot.fstore.payload.OrderDTO;

public class OrderMapper {
    public static OrderDTO toOrderDTO(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .total(order.getTotal())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .items(order.getItems() != null ? order.getItems().stream().map(CartMapper::toCartDTO).toList() : null)
                .note(order.getNote() != null ? order.getNote() : "")
                .user(order.getUser() != null ? UserMapper.toUserDTO(order.getUser()) : null)
                .createdAt(order.getCreatedAt())
                .feedback(order.getFeedback() != null ? FeedbackMapper.toFeedbackDTO(order.getFeedback()) : null)
                .build();
    }

    public static Order toOrder(OrderDTO orderDTO) {
        return Order.builder()
                .total(orderDTO.getTotal())
                .status(orderDTO.getStatus())
                .paymentMethod(orderDTO.getPaymentMethod())
                .note(orderDTO.getNote())
                .build();
    }
}
