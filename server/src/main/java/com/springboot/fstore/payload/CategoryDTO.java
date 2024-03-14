package com.springboot.fstore.payload;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryDTO {
    private int id;
    private String name;
    private String image;
}
