"use client";
import FavouriteFood from "@/components/Favourite/favourite_food_item";
import { Food, FoodSize } from "@/models/Food";
import { useState } from "react";

import { IconButton, TextButton } from "@/components/buttons";
import { HeartIcon, OutlineHeartIcon } from "@/components/icons";
import { NumberInput } from "@/components/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { ShoppingCart, SigmaIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/utils/cn";
import FoodRating from "@/components/food_rating";
import { FoodDetail } from "@/components/food_detail";
import { showDefaultToast } from "@/components/toast";
import { fakeFoodItems } from "@/fakedata/foodData";

export default function FavouritePages() {
  const [favouriteFoods, setFavouriteFoods] = useState<Food[]>(fakeFoodItems);
  const [isOpen, setOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food>(favouriteFoods[0]);
  const [selectedSize, setSelectedSize] = useState<FoodSize>(
    selectedFood.foodSizes[0]
  );
  const [selectedFoodQuantity, setSelectedFoodQuantity] = useState(1);
  const handleFoodClick = (food: Food) => {
    setSelectedFood(food);
    if (selectedFood !== food) setSelectedSize(food.foodSizes[0]);
    setOpen(!isOpen);
  };

  const handleFoodSizeChange = (foodSize: FoodSize) => {
    if (selectedSize !== foodSize) setSelectedSize(foodSize);
  };

  return (
    <div className="w-full h-screen font-sans text-primaryWord p-8 overflow-y-scroll">
      <h1 className="text-primary text-3xl font-bold mb-4">
        Your favourite foods
      </h1>
      <div className="grid grid-cols-4 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2">
        {favouriteFoods.map((food) => {
          return (
            <FavouriteFood
              key={food.id}
              food={food}
              onClick={() => handleFoodClick(food)}
            />
          );
        })}
      </div>
      <FoodDetail
        isOpen={isOpen}
        onOpenChange={() => setOpen(!isOpen)}
        food={selectedFood}
        foodQuantity={selectedFoodQuantity}
        onFoodQuantityChange={(quantity) => setSelectedFoodQuantity(quantity)}
        selectedSize={selectedSize}
        onFoodSizeChange={(foodSize) => handleFoodSizeChange(foodSize)}
        isFavorite={true}
        onFavoriteChange={(isFavorite) => {
          if (!isFavorite) {
            const newFavouriteFoods = favouriteFoods.filter(
              (food) => food !== selectedFood
            );
            setFavouriteFoods(newFavouriteFoods);
            setOpen(!isOpen);
            showDefaultToast("Removed from favourite");
          }
        }}
      />
    </div>
  );
}

const Tag = ({
  isSelected = false,
  name,
  onClick,
}: {
  isSelected?: boolean;
  name: string;
  onClick?: () => void;
}) => {
  const defaultStyle =
    "bg-white text-primaryWord hover:bg-black hover:text-white";
  const selectedStyle = "bg-black text-white hover:bg-black hover:text-white";
  return (
    <span
      className={cn(
        "cursor-pointer rounded-lg font-semibold outline outline-black outline-1 px-2 text-xs ease-linear duration-100",
        isSelected ? selectedStyle : defaultStyle
      )}
      onClick={onClick}
    >
      {name}
    </span>
  );
};
