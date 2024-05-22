package com.springboot.fstore.controller;

import com.springboot.fstore.payload.CommentDTO;
import com.springboot.fstore.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;

    @GetMapping("/{foodId}")
    public ResponseEntity<List<CommentDTO>> getCommentsOfFood(@PathVariable int foodId) {
        return ResponseEntity.ok(commentService.getCommentsofFood(foodId));
    }

    @PostMapping("/{foodId}")
    public ResponseEntity<CommentDTO> createComment(@PathVariable int foodId, @RequestBody CommentDTO commentDTO) {
        return ResponseEntity.ok(commentService.createComment(foodId, commentDTO));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDTO> updateComment(@PathVariable int commentId, @RequestBody CommentDTO commentDTO) {
        return ResponseEntity.ok(commentService.updateComment(commentId, commentDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable int id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok().build();
    }
}
