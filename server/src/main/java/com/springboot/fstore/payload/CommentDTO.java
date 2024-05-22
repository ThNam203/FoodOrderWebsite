package com.springboot.fstore.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentDTO {
    private int id;
    private String title;
    private String content;
    private Date createdAt;
    private UserDTO user;
}
