package com.springboot.fstore.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    @Schema(description = "The user's id", example = "1")
    private int id;
    @Schema(description = "The user's age", example = "20")
    private int age;
    @Schema(description = "The user's name", example = "John Doe")
    private String name;
    @Schema(description = "The user's email", example = "john@gmail.com")
    private String email;
    @Schema(description = "The user's address", example = "Hanoi")
    private String address;
    @Schema(description = "The user's phone number", example = "0123456789")
    private String phoneNumber;
    @Schema(description = "The user's preferences", example = "Music, Movie")
    private String preferences;
    @Schema(description = "The user's profile image", example = "https://www.google.com")
    private String profileImage;
    @Schema(description = "The user's role", example = "true")
    private Boolean isAdmin;
    @Schema(description = "The user's created date", example = "iso code")
    private LocalDateTime createdAt;
}
