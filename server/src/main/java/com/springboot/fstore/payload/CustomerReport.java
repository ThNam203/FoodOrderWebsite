package com.springboot.fstore.payload;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerReport {
    private int userId;
    private double totalSpent;
    private int totalOrder;
}
