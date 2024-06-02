package com.springboot.fstore.service.impl;

import com.springboot.fstore.entity.User;
import com.springboot.fstore.exception.CustomException;
import com.springboot.fstore.mapper.UserMapper;
import com.springboot.fstore.payload.AccountDTO;
import com.springboot.fstore.payload.UserDTO;
import com.springboot.fstore.repository.UserRepository;
import com.springboot.fstore.service.AuthenticationService;
import com.springboot.fstore.service.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Override
    public UserDTO register(AccountDTO request, HttpServletResponse response) {
        checkInput(request);

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException("Email already exists", HttpStatus.BAD_REQUEST);
        }

        User user = User.builder()
                .email(request.getEmail())
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .isAdmin(request.getName().equals("admin") || request.getEmail().equals("admin@gmail.com"))
                .build();

        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);

        ResponseCookie cookie = jwtService.generateCookie(jwtToken);
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    @Override
    public UserDTO authenticate(AccountDTO request, HttpServletResponse response) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException("Invalid username/password supplied", HttpStatus.BAD_REQUEST));
        System.out.println("user password: ");
        System.out.println("user: " + user.getPassword());
        System.out.println("request: " + request.getPassword());
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException("Invalid username/password supplied", HttpStatus.BAD_REQUEST);
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        var jwtToken = jwtService.generateToken(user);
        ResponseCookie cookie = jwtService.generateCookie(jwtToken);
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return UserMapper.toUserDTO(user);
    }

    private void checkInput(AccountDTO request) {
        if (request.getName() == null || request.getName().isEmpty()) {
            throw new CustomException("Name is required", HttpStatus.BAD_REQUEST);
        }
        if (!request.getEmail().matches("^(.+)@(.+)$")) {
            throw new CustomException("Invalid email", HttpStatus.BAD_REQUEST);
        }
        if (request.getEmail().isEmpty()) {
            throw new CustomException("Email is required", HttpStatus.BAD_REQUEST);
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new CustomException("Password is required", HttpStatus.BAD_REQUEST);
        }
        if (request.getPassword().length() < 6) {
            throw new CustomException("Password must be at least 6 characters", HttpStatus.BAD_REQUEST);
        }
    }
}
