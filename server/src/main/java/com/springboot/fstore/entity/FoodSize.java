package com.springboot.fstore.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "food_sizes")
public class FoodSize extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private Double price;
    private Double weight;
    private String note;
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "food_id")
    private Food food;
}
