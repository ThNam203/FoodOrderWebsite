package com.springboot.fstore.mapper;

import com.springboot.fstore.entity.Order;
import com.springboot.fstore.payload.OrderDTO;

public class OrderMapper {
    public static OrderDTO toOrderDTO(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .total(order.getTotal())
                .status(order.getStatus())
                .orderDetails(order.getOrderDetails() != null ? order.getOrderDetails().stream().map(OrderDetailMapper::toOrderDetailDTO).toList() : null)
                .build();
    }
    public static Order toOrder(OrderDTO orderDTO) {
        return Order.builder()
                .total(orderDTO.getTotal())
                .status(orderDTO.getStatus())
                .build();
    }
}
