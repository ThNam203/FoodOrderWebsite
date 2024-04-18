package com.springboot.fstore.service.impl;

import com.springboot.fstore.entity.Food;
import com.springboot.fstore.entity.User;
import com.springboot.fstore.exception.CustomException;
import com.springboot.fstore.mapper.FoodMapper;
import com.springboot.fstore.mapper.UserMapper;
import com.springboot.fstore.payload.FoodDTO;
import com.springboot.fstore.payload.UserDTO;
import com.springboot.fstore.repository.FoodRepository;
import com.springboot.fstore.repository.UserRepository;
import com.springboot.fstore.service.FileService;
import com.springboot.fstore.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final FileService fileService;
    private final FoodRepository foodRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public UserDTO getInfoMe() {
        User user = getAuthorizedUser();
        return UserMapper.toUserDTO(user);
    }

    @Override
    public UserDTO updateInfoMe(MultipartFile[] files, UserDTO userDTO) {
        User user = getAuthorizedUser();
        user.setName(userDTO.getName());
       user.setAge(userDTO.getAge());
        user.setAddress(userDTO.getAddress());
        user.setPhoneNumber(userDTO.getPhoneNumber());
       user.setPreferences(userDTO.getPreferences());
        if (files != null) {
            String url = fileService.uploadFile(files[0]);
            user.setProfileImage(url);
        }
        userRepository.save(user);
        return null;
    }

    @Override
    public void changePassword(String oldPassword, String newPassword) {
        User user = getAuthorizedUser();
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new CustomException("Old password is incorrect", HttpStatus.BAD_REQUEST);
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public User getAuthorizedUser() {
        return userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
    }
}
