package com.springboot.fstore.payload;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class FeedbackDTO {
    private int id;
    private String content;
    private Date createdAt;
    private int rating;
}
