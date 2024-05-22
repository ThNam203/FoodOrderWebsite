package com.springboot.fstore.mapper;

import com.springboot.fstore.entity.Feedback;
import com.springboot.fstore.payload.FeedbackDTO;

public class FeedbackMapper {
    public static FeedbackDTO toFeedbackDTO(Feedback feedback) {
        return FeedbackDTO.builder()
                .id(feedback.getId())
                .content(feedback.getContent())
                .createdAt(feedback.getCreatedAt())
                .rating(feedback.getRating())
                .build();
    }
    public static Feedback toFeedback(FeedbackDTO feedbackDTO) {
        return Feedback.builder()
                .content(feedbackDTO.getContent())
                .rating(feedbackDTO.getRating())
                .build();
    }
}
