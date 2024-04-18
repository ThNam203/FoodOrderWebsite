package com.springboot.fstore.controller;

import com.springboot.fstore.payload.UserDTO;
import com.springboot.fstore.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    @Operation(summary = "Get user info")
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getInfoMe() {
        return ResponseEntity.ok(userService.getInfoMe());
    }

    @Operation(summary = "Change password")
    @PostMapping("/me/change-password")
    public ResponseEntity<?> changePassword(@RequestPart(value = "oldPassword") String oldPassword, @RequestPart(value = "newPassword")  String newPassword) {
        userService.changePassword(oldPassword, newPassword);
        return ResponseEntity.status(204).build();
    }

    @Operation(summary = "Update user info")
    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateInfoMe(@RequestPart(value = "files", required = false) MultipartFile[] files,
                                                @RequestPart("data")  UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateInfoMe(files, userDTO));
    }
}
