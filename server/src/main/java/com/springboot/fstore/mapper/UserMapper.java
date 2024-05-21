package com.springboot.fstore.mapper;

import com.springboot.fstore.entity.Food;
import com.springboot.fstore.entity.User;
import com.springboot.fstore.payload.UserDTO;

public class UserMapper {
    public static UserDTO toUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .address(user.getAddress())
                .phoneNumber(user.getPhoneNumber())
                .preferences(user.getPreferences())
                .profileImage(user.getProfileImage())
                .isAdmin(user.getIsAdmin())
                .createdAt(user.getCreatedAt())
                .listFavorite(user.getFavouriteFoods() != null ? user.getFavouriteFoods()
                        .stream()
                        .filter(food -> !food.getIsDeleted())
                        .map(Food::getId).toList()
                        : null)
                .build();
    }

    public static User toUser(UserDTO userDTO) {
        return User.builder()
                .name(userDTO.getName())
                .email(userDTO.getEmail())
                .address(userDTO.getAddress())
                .phoneNumber(userDTO.getPhoneNumber())
                .preferences(userDTO.getPreferences())
                .profileImage(userDTO.getProfileImage())
                .isAdmin(userDTO.getIsAdmin())
                .build();
    }

}
