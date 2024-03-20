package com.springboot.fstore.controller;

import com.springboot.fstore.payload.AccountDTO;
import com.springboot.fstore.payload.UserDTO;
import com.springboot.fstore.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthenticationController {
    final AuthenticationService service;

    @Operation(summary = "Register")
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(
            @RequestBody AccountDTO request,
            HttpServletResponse response
    ) {
        return ResponseEntity.status(201).body(service.register(request, response));
    }

    @Operation(summary = "Authenticate")
    @PostMapping("/authenticate")
    public ResponseEntity<UserDTO> authenticate(
            @RequestBody AccountDTO request,
            HttpServletResponse response
    ) {
        return ResponseEntity.ok().body(service.authenticate(request, response));
    }
}
