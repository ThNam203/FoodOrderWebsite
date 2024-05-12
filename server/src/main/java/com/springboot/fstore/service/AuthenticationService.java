package com.springboot.fstore.service;

import com.springboot.fstore.payload.AccountDTO;
import com.springboot.fstore.payload.UserDTO;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthenticationService {
    UserDTO register(AccountDTO request, HttpServletResponse response);

    UserDTO authenticate(AccountDTO request, HttpServletResponse response);
}
