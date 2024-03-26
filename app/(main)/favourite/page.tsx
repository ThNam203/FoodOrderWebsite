"use client";
import FavouriteFood from "@/components/Favourite/favourite_food_item";
import { Food, FoodSize } from "@/models/Food";
import { useState } from "react";
import { fakeFoodData } from "./fakedata";

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

export default function FavouritePages() {
  const [favouriteFoods, setFavouriteFoods] = useState<Food[]>(fakeFoodData);
  const [isOpen, setOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food>(favouriteFoods[0]);
  const [selectedSize, setSelectedSize] = useState<FoodSize>(
    selectedFood.foodSizes[0]
  );
  const [selectedFoodQuantity, setSelectedFoodQuantity] = useState(1);
  const handleFoodClick = (food: any) => {
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
      <Modal
        isOpen={isOpen}
        onOpenChange={() => setOpen(!isOpen)}
        className="text-primaryWord rounded-lg overflow-hidden"
        hideCloseButton
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <div className="w-full h-40 overflow-hidden">
                <div
                  className="object-center hover:scale-125 h-40 ease-linear transition-all duration-300"
                  style={{
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundImage: `url(${selectedFood.image})`,
                  }}
                ></div>
              </div>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex flex-col items-start">
                  <div className="flex flex-row items-center gap-2">
                    <span>{selectedFood.name}</span>
                    <IconButton
                      className="rounded-full ease-linear duration-100"
                      icon={<HeartIcon />}
                      onClick={() => {
                        alert("Removed");
                      }}
                    />
                  </div>
                  <div className="w-full flex flex-row items-center justify-between">
                    <p className="text-xl">
                      {selectedFood.currency + selectedSize.price}
                    </p>
                    <div className="w-min font-sans">
                      <NumberInput
                        className="outline-0 text-primaryWord"
                        value={selectedFoodQuantity}
                        onDecrease={() =>
                          setSelectedFoodQuantity(
                            selectedFoodQuantity <= 1
                              ? 1
                              : selectedFoodQuantity - 1
                          )
                        }
                        onIncrease={() =>
                          setSelectedFoodQuantity(selectedFoodQuantity + 1)
                        }
                        onChange={(e) =>
                          setSelectedFoodQuantity(
                            Number.parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-row gap-2 items-center">
                  {selectedFood.foodSizes.map((size) => {
                    return (
                      <Tag
                        key={size.name}
                        isSelected={selectedSize === size}
                        name={size.name}
                        onClick={() => handleFoodSizeChange(size)}
                      />
                    );
                  })}
                </div>
                <FoodRating rating={selectedFood.rating} className="mt-2" />
              </ModalHeader>
              <ModalBody>
                <p>
                  Food description here. Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Nullam pulvinar risus non risus hendrerit
                  venenatis. Pellentesque sit amet hendrerit risus, sed
                  porttitor quam.
                </p>
              </ModalBody>
              <ModalFooter>
                <TextButton
                  iconAfter={<ShoppingCart className="w-4 h-4" />}
                  content="Add to cart"
                  className="w-min gap-2 text-nowrap text-primaryWord bg-transparent hover:text-primary hover:bg-transparent ease-linear duration-100"
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
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
