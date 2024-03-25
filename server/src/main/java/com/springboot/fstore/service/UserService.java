package com.springboot.fstore.service;

import com.springboot.fstore.entity.User;
import com.springboot.fstore.payload.FoodDTO;
import com.springboot.fstore.payload.UserDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    UserDTO getInfoMe();
    UserDTO updateInfoMe(MultipartFile[] files, UserDTO userDTO);
    void changePassword(String oldPassword, String newPassword);
    User getAuthorizedUser();
}
