package com.springboot.fstore.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDTO {
    private int id;
    private Double total;
    private String status;
    private String paymentMethod;
    private List<CartDTO> items;
    private LocalDateTime createdAt;
    private Integer userId;
}
