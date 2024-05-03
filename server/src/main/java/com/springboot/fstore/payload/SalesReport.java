package com.springboot.fstore.payload;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SalesReport {
    private LocalDateTime date;
    private double revenue;
}
