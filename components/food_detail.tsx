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
import { ReactNode, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { displayNumber } from "@/utils/func";
import CommentSection from "./comment_section";
import ImageCarousel from "./CustomCarousel/image_carousel";
import { useDotButton } from "./CustomCarousel/carousel_dot_button";
import { useAppSelector } from "@/redux/hooks";
import { showDefaultToast } from "./toast";

enum TabTitle {
  Info = "Info",
  Review = "Review",
}

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
  const [emblaRef, emplaApi] = useEmblaCarousel({
    loop: false,
    watchDrag: false,
  });
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emplaApi);
  const isLogin = useAppSelector((state) => state.profile.isLogin);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => onOpenChange(!isOpen)}
      className={cn(
        "z-50 text-primaryWord rounded-lg overflow-hidden",
        className
      )}
      hideCloseButton
      size="5xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <div className="w-full overflow-hidden rounded-md" ref={emblaRef}>
              <div className="w-full flex items-start">
                <div
                  className="flex-[0_0_100%] overflow-y-scroll scrollbar scrollbar-hide h-[60vh] pt-2"
                  draggable={false}
                >
                  <ModalHeader className="flex flex-row gap-2 font-sans">
                    <div className="w-1/3 lg:h-48 max-lg:h-40 max-sm:h-28">
                      <ImageCarousel
                        carouselItems={food.images.map((image) => {
                          return { image: image };
                        })}
                      />
                    </div>
                    <div className="w-2/3 flex flex-col gap-1">
                      <div className="flex flex-col items-start">
                        <div className="flex flex-row items-center gap-2">
                          <span>{food.name}</span>
                          <IconButton
                            className="rounded-full ease-linear duration-100"
                            icon={
                              isFavorite ? <HeartIcon /> : <OutlineHeartIcon />
                            }
                            onClick={() => {
                              if (!isLogin) {
                                {
                                  showDefaultToast(
                                    "Please login to add your favourite food"
                                  );
                                  return;
                                }
                              }
                              if (onFavoriteChange)
                                onFavoriteChange(!isFavorite);
                            }}
                          />
                        </div>
                        <div className="w-full flex flex-row items-center justify-between">
                          <p className="text-xl">
                            {displayNumber(selectedSize.price, "$")}
                          </p>
                          <div className="w-min font-sans">
                            <NumberInput
                              className="outline-0 text-primaryWord"
                              value={foodQuantity}
                              onDecrease={() =>
                                onFoodQuantityChange(
                                  foodQuantity <= 1 ? 1 : foodQuantity - 1
                                )
                              }
                              onIncrease={() =>
                                onFoodQuantityChange(foodQuantity + 1)
                              }
                              onChange={(e) =>
                                onFoodQuantityChange(
                                  Number.parseInt(e.target.value)
                                )
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
                      <div className="font-normal text-base">
                        {selectedSize.note}
                      </div>
                      <div
                        className={cn(
                          "flex flex-row items-center",
                          food.rating === 0 ? "opacity-0" : ""
                        )}
                      >
                        <FoodRating rating={food.rating} />
                        {food.tags.map((tag) => {
                          return <Tag key={tag} name={tag} />;
                        })}
                      </div>
                    </div>
                  </ModalHeader>

                  <ModalBody className="font-sans">
                    <span className="font-semibold">Desciption</span>
                    <p>{food.description}</p>
                  </ModalBody>
                </div>
                <div className="flex-[0_0_100%] overflow-y-scroll font-sans pt-4">
                  <CommentSection foodId={food.id} />
                </div>
              </div>
            </div>

            <ModalFooter className="relative w-full flex flex-row items-center font-sans">
              <div className="absolute left-1/2 -translate-x-1/2 w-fit h-fit flex flex-row items-center justify-center rounded-2xl overflow-hidden border-2 border-black">
                <Tab
                  selectedIndex={selectedIndex}
                  index={0}
                  setSelectedIndex={(index) => onDotButtonClick(index)}
                  content={TabTitle.Info}
                />
                <Tab
                  selectedIndex={selectedIndex}
                  index={1}
                  setSelectedIndex={(index) => onDotButtonClick(index)}
                  content={TabTitle.Review}
                />
              </div>
              <TextButton
                iconAfter={<ShoppingCart className="w-4 h-4" />}
                className="w-min justify-self-end gap-2 font-sans text-nowrap text-primaryWord bg-transparent hover:text-primary hover:bg-transparent ease-linear duration-100"
                onClick={onAddToCart}
              >
                Add to cart
              </TextButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export const FoodProperty = ({
  isSelected = false,
  name,
  onClick,
  className,
}: {
  isSelected?: boolean;
  name: string;
  onClick?: () => void;
  className?: ClassValue;
}) => {
  const defaultStyle =
    "bg-white text-primaryWord hover:bg-black hover:text-white";
  const selectedStyle = "bg-black text-white hover:bg-black hover:text-white";
  return (
    <span
      className={cn(
        "cursor-pointer rounded-[999px] font-semibold outline outline-black outline-1 px-2 text-xs ease-linear duration-100 flex items-center capitalize",
        isSelected ? selectedStyle : defaultStyle,
        className
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

const Tab = ({
  className,
  content,
  selectedIndex,
  index,
  setSelectedIndex,
  onClick,
}: {
  className?: ClassValue;
  content: string;
  selectedIndex: number;
  index: number;
  setSelectedIndex: (index: number) => void;
  onClick?: () => void;
}) => {
  const defaultTabStyle = "text-white bg-black hover:text-primary";
  const selectedTabStyle = "text-primaryWord bg-white hover:text-primaryWord";

  return (
    <span
      className={cn(
        "min-w-[100px] px-4 ease-linear duration-200 cursor-pointer text-center",
        selectedIndex === index ? selectedTabStyle : defaultTabStyle,
        className
      )}
      onClick={() => {
        setSelectedIndex(index);
        if (onClick) onClick();
      }}
    >
      {content}
    </span>
  );
};
