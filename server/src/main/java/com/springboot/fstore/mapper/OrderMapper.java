package com.springboot.fstore.mapper;

import com.springboot.fstore.entity.Order;
import com.springboot.fstore.payload.OrderDTO;

public class OrderMapper {
    public static OrderDTO toOrderDTO(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .total(order.getTotal())
                .status(order.getStatus())
                .items(order.getItems() != null ? order.getItems().stream().map(CartMapper::toCartDTO).toList() : null)
                .createdAt(order.getCreatedAt())
                .build();
    }
    public static Order toOrder(OrderDTO orderDTO) {
        return Order.builder()
                .total(orderDTO.getTotal())
                .status(orderDTO.getStatus())
                .build();
    }
}
