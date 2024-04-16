"use client";

import { IconButton, TextButton } from "@/components/buttons";
import FoodRating from "@/components/food_rating";
import { HeartIcon, OutlineHeartIcon } from "@/components/icons";
import { NumberInput } from "@/components/input";
import { Food, FoodSize } from "@/models/Food";
import { cn } from "@/utils/cn";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { ClassValue } from "clsx";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export const FoodDetail = ({
  isOpen,
  onOpenChange,
  food,
  foodQuantity,
  onFoodQuantityChange,
  selectedSize,
  onFoodSizeChange,
  isFavorite = false,
  onFavoriteChange,
  onAddToCart,
  className,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  food: Food;
  foodQuantity: number;
  onFoodQuantityChange: (quantity: number) => void;
  selectedSize: FoodSize;
  onFoodSizeChange: (foodSize: FoodSize) => void;
  isFavorite?: boolean;
  onFavoriteChange?: (isFavorite: boolean) => void;
  onAddToCart?: () => void;
  className?: ClassValue;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => onOpenChange(!isOpen)}
      className={cn(
        "h-5/6 w-screen text-primaryWord rounded-lg overflow-hidden",
        className
      )}
      hideCloseButton
      size="5xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <div className="w-full h-72 overflow-hidden">
              <div
                className="hover:scale-125 h-72 ease-linear transition-all duration-300"
                style={{
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundImage: `url(${food.images[0]})`,
                }}
              ></div>
            </div>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex flex-col items-start">
                <div className="flex flex-row items-center gap-2">
                  <span>{food.name}</span>
                  <IconButton
                    className="rounded-full ease-linear duration-100"
                    icon={isFavorite ? <HeartIcon /> : <OutlineHeartIcon />}
                    onClick={() => {
                      if (onFavoriteChange) onFavoriteChange(!isFavorite);
                    }}
                  />
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                  <p className="text-xl">{selectedSize.price + "đ"}</p>
                  <div className="w-min font-sans">
                    <NumberInput
                      className="outline-0 text-primaryWord"
                      value={foodQuantity}
                      onDecrease={() =>
                        onFoodQuantityChange(
                          foodQuantity <= 1 ? 1 : foodQuantity - 1
                        )
                      }
                      onIncrease={() => onFoodQuantityChange(foodQuantity + 1)}
                      onChange={(e) =>
                        onFoodQuantityChange(Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-2 items-center">
                {food.foodSizes.map((size) => {
                  return (
                    <FoodProperty
                      key={size.name}
                      isSelected={selectedSize === size}
                      name={size.name}
                      onClick={() => onFoodSizeChange(size)}
                    />
                  );
                })}
              </div>
              <div className="font-normal text-base">{selectedSize.note}</div>
              <div className="flex flex-row items-center">
                <FoodRating rating={food.rating} />
                {food.tags.map((tag) => {
                  return <Tag key={tag} name={tag} />;
                })}
              </div>
            </ModalHeader>
            <ModalBody>
              <p>
                Food description here. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Nullam pulvinar risus non risus hendrerit
                venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                quam.
              </p>
            </ModalBody>
            <ModalFooter>
              <TextButton
                iconAfter={<ShoppingCart className="w-4 h-4" />}
                content="Add to cart"
                className="w-min gap-2 text-nowrap text-primaryWord bg-transparent hover:text-primary hover:bg-transparent ease-linear duration-100"
                onClick={onAddToCart}
              />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const FoodProperty = ({
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

const Tag = ({ name }: { name: string }) => (
  <span className="hover:cursor-pointer hover:bg-slate-500 hover:text-slate-200 rounded-md font-semibold bg-slate-200 px-2 py-1 text-gray-700 font-hairline text-xs ml-1">
    {name}
  </span>
);
