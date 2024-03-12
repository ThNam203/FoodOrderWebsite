package com.springboot.fstore.config;

import com.springboot.fstore.repository.TokenRepository;
import com.springboot.fstore.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {
    private final JwtService jwtService;
    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        jwt = jwtService.getJwtAccessFromCookie(request);
        if (jwt == null || jwt.isEmpty()) {
            return;
        }
        response.addHeader("Set-Cookie", "access-token=; Path=/; HttpOnly; Max-Age=0");
    }
}
