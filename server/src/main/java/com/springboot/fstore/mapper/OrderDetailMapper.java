package com.springboot.fstore.mapper;

import com.springboot.fstore.entity.OrderDetail;
import com.springboot.fstore.payload.OrderDetailDTO;

public class OrderDetailMapper {
    public static OrderDetailDTO toOrderDetailDTO(OrderDetail orderDetail) {
        return OrderDetailDTO.builder()
                .id(orderDetail.getId())
                .quantity(orderDetail.getQuantity())
                .price(orderDetail.getPrice())
                .food(orderDetail.getFood() != null ? FoodMapper.toFoodDTO(orderDetail.getFood()) : null)
                .foodSize(orderDetail.getFoodSize() != null ? FoodSizeMapper.toFoodSizeDTO(orderDetail.getFoodSize()): null)
                .build();
    }

    public static OrderDetail toOrderDetail(OrderDetailDTO orderDetailDTO) {
        return OrderDetail.builder()
                .quantity(orderDetailDTO.getQuantity())
                .price(orderDetailDTO.getPrice())
                .build();
    }
}
