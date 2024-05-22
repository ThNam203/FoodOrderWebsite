package com.springboot.fstore.repository;

import com.springboot.fstore.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByFoodId(int foodId);
}
