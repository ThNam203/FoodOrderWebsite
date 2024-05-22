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
import { ReactNode, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { displayNumber } from "@/utils/func";

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
  const [emblaRef, emplaApi] = useEmblaCarousel({ loop: false });
  const [selectedTab, setSelectedTab] = useState<TabTitle>(TabTitle.Info);
  const handleSelectedTabChange = (tab: TabTitle) => {
    if (tab === selectedTab) return;
    if (tab === TabTitle.Review && emplaApi) emplaApi.scrollNext();
    if (tab === TabTitle.Info && emplaApi) emplaApi.scrollPrev();
    setSelectedTab(tab);
  };
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
              <div className="w-full flex items-center">
                <div className="flex-[0_0_100%]">
                  <div className="w-full h-72 overflow-hidden">
                    <div
                      className="hover:scale-125 ease-linear transition-all duration-300"
                      style={{
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundImage: `url(${food.images[0]})`,
                        height: "100%",
                      }}
                    ></div>
                  </div>
                  <ModalHeader className="flex flex-col gap-1 font-sans">
                    <div className="flex flex-col items-start">
                      <div className="flex flex-row items-center gap-2">
                        <span>{food.name}</span>
                        <IconButton
                          className="rounded-full ease-linear duration-100"
                          icon={
                            isFavorite ? <HeartIcon /> : <OutlineHeartIcon />
                          }
                          onClick={() => {
                            if (onFavoriteChange) onFavoriteChange(!isFavorite);
                          }}
                        />
                      </div>
                      <div className="w-full flex flex-row items-center justify-between">
                        <p className="text-xl">
                          {displayNumber(selectedSize.price, "đ")}
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
                    <div className="flex flex-row items-center">
                      <FoodRating rating={food.rating} />
                      {food.tags.map((tag) => {
                        return <Tag key={tag} name={tag} />;
                      })}
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    <p className="font-sans">
                      Food description here. Lorem ipsum dolor sit amet,
                      consectetur adipiscing elit. Nullam pulvinar risus non
                      risus hendrerit venenatis. Pellentesque sit amet hendrerit
                      risus, sed porttitor quam.
                    </p>
                  </ModalBody>
                </div>
                <div className="flex-[0_0_100%]">
                  <div className="w-full h-72 overflow-hidden">
                    <div
                      className="hover:scale-125 ease-linear transition-all duration-300"
                      style={{
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundImage: `url(${food.images[0]})`,
                        height: "100%",
                      }}
                    ></div>
                  </div>
                  <ModalHeader className="flex flex-col gap-1 font-sans">
                    <div className="flex flex-col items-start">
                      <div className="flex flex-row items-center gap-2">
                        <span>{food.name}</span>
                        <IconButton
                          className="rounded-full ease-linear duration-100"
                          icon={
                            isFavorite ? <HeartIcon /> : <OutlineHeartIcon />
                          }
                          onClick={() => {
                            if (onFavoriteChange) onFavoriteChange(!isFavorite);
                          }}
                        />
                      </div>
                      <div className="w-full flex flex-row items-center justify-between">
                        <p className="text-xl">
                          {displayNumber(selectedSize.price, "đ")}
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
                    <div className="flex flex-row items-center">
                      <FoodRating rating={food.rating} />
                      {food.tags.map((tag) => {
                        return <Tag key={tag} name={tag} />;
                      })}
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    <p className="font-sans">
                      Food description here. Lorem ipsum dolor sit amet,
                      consectetur adipiscing elit. Nullam pulvinar risus non
                      risus hendrerit venenatis. Pellentesque sit amet hendrerit
                      risus, sed porttitor quam.
                    </p>
                  </ModalBody>
                </div>
              </div>
            </div>

            <ModalFooter className="w-full flex flex-row items-center font-sans">
              <div className="h-fit flex-1 items-center">
                <div className="mx-auto w-fit h-fit flex flex-row items-center justify-center rounded-2xl overflow-hidden border-2 border-black">
                  <Tab
                    selectedTab={selectedTab}
                    setSelectedTab={(tab) =>
                      handleSelectedTabChange(tab as TabTitle)
                    }
                    content={TabTitle.Info}
                  />
                  <Tab
                    selectedTab={selectedTab}
                    setSelectedTab={(tab) =>
                      handleSelectedTabChange(tab as TabTitle)
                    }
                    content={TabTitle.Review}
                  />
                </div>
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

const Tab = ({
  className,
  content,
  selectedTab,
  setSelectedTab,
  onClick,
}: {
  className?: ClassValue;
  content: string;
  selectedTab?: string;
  setSelectedTab: (selectedTab: string) => void;
  onClick?: () => void;
}) => {
  const defaultTabStyle = "text-white bg-black hover:text-primary";
  const selectedTabStyle = "text-primaryWord bg-white hover:text-primaryWord";

  return (
    <span
      className={cn(
        "min-w-[100px] px-4 ease-linear duration-200 cursor-pointer text-center",
        selectedTab === content ? selectedTabStyle : defaultTabStyle,
        className
      )}
      onClick={() => {
        setSelectedTab(content);
        if (onClick) onClick();
      }}
    >
      {content}
    </span>
  );
};
