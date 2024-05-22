package com.springboot.fstore.mapper;

import com.springboot.fstore.entity.Comment;
import com.springboot.fstore.payload.CommentDTO;

public class CommentMapper {
    public static CommentDTO toCommentDTO(Comment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .title(comment.getTitle())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .rating(comment.getRating())
                .user(UserMapper.toUserDTO(comment.getUser()))
                .build();
    }

    public static Comment toComment(CommentDTO commentDTO) {
        return Comment.builder()
                .id(commentDTO.getId())
                .title(commentDTO.getTitle())
                .content(commentDTO.getContent())
                .rating(commentDTO.getRating())
                .createdAt(commentDTO.getCreatedAt())
                .build();
    }
}
