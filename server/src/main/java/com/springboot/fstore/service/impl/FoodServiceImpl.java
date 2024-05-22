package com.springboot.fstore.service.impl;

import com.springboot.fstore.entity.*;
import com.springboot.fstore.exception.CustomException;
import com.springboot.fstore.exception.ResourceNotFoundException;
import com.springboot.fstore.mapper.FoodMapper;
import com.springboot.fstore.mapper.FoodRattingMapper;
import com.springboot.fstore.mapper.FoodSizeMapper;
import com.springboot.fstore.payload.FoodDTO;
import com.springboot.fstore.payload.FoodRattingDTO;
import com.springboot.fstore.repository.*;
import com.springboot.fstore.service.FileService;
import com.springboot.fstore.service.FoodService;
import com.springboot.fstore.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodServiceImpl implements FoodService {
    private final UserService userService;
    private final FoodRepository foodRepository;
    private final FoodRattingRepository foodRattingRepository;
    private final OrderRepository orderRepository;
    private final CategoryRepository categoryRepository;
    private final FileService fileService;

    @Override
    public FoodDTO createFood(MultipartFile[] files, FoodDTO foodDTO) {
        Food food = FoodMapper.toFood(foodDTO);
        food.setFoodRattings(new ArrayList<>());

        if (files != null) {
            List<Image> images = new ArrayList<>();
            for (MultipartFile file : files) {
                String url = fileService.uploadFile(file);
                if (url == null) continue;
                Image image = Image.builder()
                        .url(url)
                        .build();
                images.add(image);
            }
            if (!images.isEmpty()) {
                food.setImages(images);
            }
        }

        if (foodDTO.getTags() != null) {
            food.setTags(foodDTO.getTags()
                    .stream()
                    .map(tag -> {
                        return Tag.builder()
                                .name(tag)
                                .build();
                    })
                    .toList());
        }

        if (foodDTO.getCategory() != null) {
            Category category = categoryRepository.findById(foodDTO.getCategory().getId()).orElseThrow(() -> new CustomException("Category not found", HttpStatus.NOT_FOUND));
            food.setCategory(category);
        }

        if (foodDTO.getFoodSizes() != null) {
            food.setFoodSizes(foodDTO.getFoodSizes()
                    .stream()
                    .map(foodSizeDTO -> {
                        FoodSize foodSize = FoodSizeMapper.toFoodSize(foodSizeDTO);
                        foodSize.setFood(food);
                        return foodSize;
                    })
                    .toList());
        }

        Food newFood = foodRepository.save(food);

        return FoodMapper.toFoodDTO(newFood);
    }

    @Override
    public FoodDTO updateFood(int foodId, MultipartFile[] files, FoodDTO foodDTO) {
        Food food = foodRepository.findById(foodId).orElseThrow(() -> new CustomException("Food not found", HttpStatus.NOT_FOUND));
        food.setName(foodDTO.getName());
        food.setDescription(foodDTO.getDescription());
        food.setStatus(foodDTO.getStatus());

        food.getTags().clear();

        //check if user remove some images
        List<String> currentImages = food.getImages().stream().map(Image::getUrl).toList();
        List<String> uploadedImages = foodDTO.getImages();
        List<String> intersec = new ArrayList<>();
        // get intersec of currentImages and uploadedImages
        for (String image : uploadedImages) {
            if (currentImages.contains(image)) {
                intersec.add(image);
            }
        }
        food.getImages().removeIf(image -> !intersec.contains(image.getUrl()));

        if (files != null) {
            List<Image> images = new ArrayList<>();
            for (MultipartFile file : files) {
                String url = fileService.uploadFile(file);
                if (url == null) continue;
                Image image = Image.builder()
                        .url(url)
                        .build();
                images.add(image);
            }

            if (!images.isEmpty()) {
                food.getImages().addAll(images);
            }
        }
        if (foodDTO.getTags() != null) {
            food.getTags().addAll(foodDTO.getTags()
                    .stream()
                    .map(tag -> {
                        return Tag.builder()
                                .name(tag)
                                .build();
                    })
                    .toList());
        }

        if (foodDTO.getCategory() == null)
            food.setCategory(null);
        else {
            if (food.getCategory() == null || foodDTO.getCategory().getId() != food.getCategory().getId()) {
                Category category = categoryRepository.findById(foodDTO.getCategory().getId()).orElseThrow(() -> new CustomException("Category not found", HttpStatus.NOT_FOUND));
                food.setCategory(category);
            }
        }

        if (food.getFoodSizes() != null) {
            for (FoodSize foodSize : food.getFoodSizes()) {
                foodSize.setDeleted(true);
            }
        }

        if (foodDTO.getFoodSizes() != null) {
            food.getFoodSizes().addAll(foodDTO.getFoodSizes()
                    .stream()
                    .map(foodSizeDTO -> {
                        FoodSize foodSize = FoodSizeMapper.toFoodSize(foodSizeDTO);
                        foodSize.setFood(food);
                        return foodSize;
                    })
                    .toList());
        }
        System.out.println(foodDTO.getFoodSizes());
        Food newFood = foodRepository.save(food);
        return FoodMapper.toFoodDTO(newFood);
    }

    @Override
    public FoodDTO getFood(int id) {
        User user = userService.getAuthorizedUser();
        Food food = foodRepository.findById(id).orElseThrow(() -> new CustomException("Food not found", HttpStatus.NOT_FOUND));

        List<Order> orders = orderRepository.findAllByUserId(user.getId());
        boolean isPurchased = orders.stream().anyMatch(order -> order.getItems().stream().anyMatch(cart -> cart.getFood().getId() == food.getId()));
        FoodDTO foodDTO = FoodMapper.toFoodDTO(food);
        foodDTO.setPurchased(isPurchased);

        return foodDTO;
    }

    @Override
    public void deleteFood(int id) {
        Food food = foodRepository.findById(id).orElseThrow(() -> new CustomException("Food not found", HttpStatus.NOT_FOUND));
        food.setIsDeleted(true);
        foodRepository.save(food);
    }

    @Override
    public List<FoodDTO> getFoods() {
        User user = userService.getAuthorizedUser();
        List<Food> foods = foodRepository.findAll();
        List<Order> orders = orderRepository.findAllByUserId(user.getId());

        return foods.stream()
                .map(food -> {
                    boolean isPurchased = orders.stream().anyMatch(order -> order.getItems().stream().anyMatch(cart -> cart.getFood().getId() == food.getId()));
                    FoodDTO foodDTO = FoodMapper.toFoodDTO(food);
                    foodDTO.setPurchased(isPurchased);
                    return foodDTO;
                })
                .toList();
    }

    @Override
    public void rateFood(int foodId, FoodRattingDTO foodRattingDTO) {
        User user = userService.getAuthorizedUser();
        Food food = foodRepository.findById(foodId).orElseThrow(() -> new CustomException("Food not found", HttpStatus.NOT_FOUND));

        if (foodRattingDTO.getRate() < 1 || foodRattingDTO.getRate() > 5) {
            throw new CustomException("Rate must be between 1 and 5", HttpStatus.BAD_REQUEST);
        }

        if (food.getFoodRattings().stream().anyMatch(foodRatting -> foodRatting.getUser().getId() == user.getId())) {
            FoodRatting foodRatting = foodRattingRepository.findByFoodIdAndUserId(foodId, user.getId()).orElseThrow(() -> new CustomException("Food ratting not found", HttpStatus.NOT_FOUND));
            foodRatting.setRate(foodRattingDTO.getRate());
            foodRatting.setComment(foodRattingDTO.getComment());
            foodRattingRepository.save(foodRatting);
        } else {
            FoodRatting foodRatting = FoodRattingMapper.toFoodRatting(foodRattingDTO);
            foodRatting.setFood(food);
            foodRatting.setUser(user);

            food.getFoodRattings().add(foodRatting);
            foodRepository.save(food);
        }
    }
}
