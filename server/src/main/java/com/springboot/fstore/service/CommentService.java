package com.springboot.fstore.service;

import com.springboot.fstore.payload.CommentDTO;

import java.util.List;

public interface CommentService {
    CommentDTO createComment(int foodId, CommentDTO commentDTO);

    CommentDTO updateComment(int commentId, CommentDTO commentDTO);

    void deleteComment(int id);

    List<CommentDTO> getCommentsofFood(int foodId);
}
