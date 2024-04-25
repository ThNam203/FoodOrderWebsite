"use client";
import FavouriteFood from "@/components/Favourite/favourite_food_item";
import { Food, FoodSize } from "@/models/Food";
import { useEffect, useState } from "react";

import { FoodDetail } from "@/components/food_detail";
import { showDefaultToast, showErrorToast } from "@/components/toast";
import { fakeFoodItems } from "@/fakedata/foodData";
import { cn } from "@/utils/cn";
import FoodService from "@/services/foodService";
import { FoodToReceive } from "@/convertor/foodConvertor";
import Image from "next/image";

export default function FavouritePages() {
  const [favouriteFoods, setFavouriteFoods] = useState<Food[]>([]);
  const [favoriteFoodIds, setFavoriteFoodIds] = useState<number[]>([]);

  const [isOpen, setOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food>();
  const [selectedSize, setSelectedSize] = useState<FoodSize>();
  const [selectedFoodQuantity, setSelectedFoodQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      await FoodService.getFavouriteFoods()
        .then((res) => {
          const favouriteFoods = res.data.map((food) => FoodToReceive(food));
          setFavouriteFoods(favouriteFoods);
          setFavoriteFoodIds(favouriteFoods.map((food) => food.id));
        })
        .catch((err) => {
          showErrorToast("Failed to fetch favourite foods" + err);
        });
    };
    fetchData();
  }, []);

  const handleFoodClick = (food: Food) => {
    setSelectedFood(food);
    if (selectedFood !== food) setSelectedSize(food.foodSizes[0]);
    setOpen(!isOpen);
  };

  const handleFoodSizeChange = (foodSize: FoodSize) => {
    if (selectedSize !== foodSize) setSelectedSize(foodSize);
  };

  const handleFavoriteFoodIdsChange = async (id: number) => {
    await FoodService.addFavouriteFood(id)
      .then(() => {
        onFavoriteFoodIdsChange(id);
      })
      .catch((err) => {
        showErrorToast("Failed to add to favorite");
      });
  };

  const onFavoriteFoodIdsChange = (id: number) => {
    if (favoriteFoodIds.includes(id)) {
      const newFavoriteFoodIds = favoriteFoodIds.filter((foodId) => {
        return foodId !== id;
      });
      setFavoriteFoodIds(newFavoriteFoodIds);
    } else {
      setFavoriteFoodIds([...favoriteFoodIds, id]);
    }
  };

  return (
    <div className="w-full h-screen font-sans text-primaryWord p-8 overflow-y-scroll">
      <h1 className="text-primary text-3xl font-bold mb-4">
        Your favourite foods
      </h1>
      {favouriteFoods.length === 0 && <EmptyItem />}
      <div
        className={cn(
          "grid grid-cols-4 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2",
          favouriteFoods.length === 0 ? "hidden" : ""
        )}
      >
        {favouriteFoods.map((food) => {
          return (
            <FavouriteFood
              key={food.id}
              food={food}
              isFavorite={favoriteFoodIds.includes(food.id)}
              onFavoriteChange={(isFavorite) => {
                handleFavoriteFoodIdsChange(food.id);
              }}
              onClick={() => handleFoodClick(food)}
            />
          );
        })}
      </div>
      {selectedFood && (
        <FoodDetail
          isOpen={isOpen}
          onOpenChange={() => setOpen(!isOpen)}
          food={selectedFood!}
          foodQuantity={selectedFoodQuantity}
          onFoodQuantityChange={(quantity) => setSelectedFoodQuantity(quantity)}
          selectedSize={selectedSize!}
          onFoodSizeChange={(foodSize) => handleFoodSizeChange(foodSize)}
          isFavorite={favoriteFoodIds.includes(selectedFood.id)}
          onFavoriteChange={(isFavorite) => {
            handleFavoriteFoodIdsChange(selectedFood.id);
          }}
        />
      )}
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

const EmptyItem = () => {
  return (
    <div className="h-full flex flex-col items-center gap-10 mt-10">
      <Image
        width={300}
        height={200}
        src="/images/empty_item.png"
        alt="empty item image"
      />
      <span className="text-secondaryWord text-xl">
        Shopping more to find your favorite food
      </span>
    </div>
  );
};
