package com.springboot.fstore.service.impl;

import com.springboot.fstore.entity.Comment;
import com.springboot.fstore.entity.Food;
import com.springboot.fstore.entity.User;
import com.springboot.fstore.exception.CustomException;
import com.springboot.fstore.mapper.CommentMapper;
import com.springboot.fstore.payload.CommentDTO;
import com.springboot.fstore.repository.CommentRepository;
import com.springboot.fstore.repository.FoodRepository;
import com.springboot.fstore.service.CommentService;
import com.springboot.fstore.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final UserService userService;
    private final FoodRepository foodRepository;
    private final CommentRepository commentRepository;

    @Override
    public CommentDTO createComment(int foodId, CommentDTO commentDTO) {
        User user = userService.getAuthorizedUser();
        Food food = foodRepository.findById(foodId).orElseThrow(() -> new CustomException("Food not found", HttpStatus.NOT_FOUND));

        Comment comment = CommentMapper.toComment(commentDTO);
        comment.setUser(user);
        comment.setFood(food);
        comment.setCreatedAt(new Date());

        return CommentMapper.toCommentDTO(commentRepository.save(comment));
    }

    @Override
    public CommentDTO updateComment(int commentId, CommentDTO commentDTO) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CustomException("Comment not found", HttpStatus.NOT_FOUND));
        comment.setTitle(commentDTO.getTitle());
        comment.setContent(commentDTO.getContent());
        comment.setRating(commentDTO.getRating());

        return CommentMapper.toCommentDTO(commentRepository.save(comment));
    }

    @Override
    public void deleteComment(int id) {
        commentRepository.deleteById(id);
    }

    @Override
    public List<CommentDTO> getCommentsofFood(int foodId) {
        List<Comment> comments = commentRepository.findByFoodId(foodId);
        return comments.stream().map(CommentMapper::toCommentDTO).toList();
    }
}
