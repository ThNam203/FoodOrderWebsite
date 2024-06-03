import { Food, FoodSize } from "@/models/Food";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { HeartIcon, OutlineHeartIcon } from "../icons";
import { IconButton } from "../buttons";
import FoodRating from "../food_rating";
import { useState } from "react";
import { FoodPrice } from "../food_price";

export default function FavouriteFood({
  food,
  className,
  onClick,
  isFavorite = false,
  onFavoriteChange,
}: {
  food: Food;
  className?: string;
  onClick?: () => void;
  isFavorite?: boolean;
  onFavoriteChange?: (isFavorite: boolean) => void;
}) {
  const sortedPriceList = food.foodSizes
    .map((foodSize) => foodSize.price)
    .sort();

  return (
    <div
      className={cn(
        "w-full h-min flex flex-col rounded overflow-hidden shadow-lg",
        className
      )}
    >
      <div className="w-full h-40 overflow-hidden cursor-pointer">
        <div
          className="object-center hover:scale-125 h-40 ease-linear transition-all duration-300"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${food.images[0]})`,
          }}
          onClick={onClick}
        ></div>
      </div>
      <div className="flex flex-col m-2 gap-2">
        <div className="w-full flex flex-row items-center justify-between">
          <span className="font-semibold">{food.name}</span>
          <IconButton
            className={cn("rounded-full ease-linear duration-100")}
            icon={isFavorite ? <HeartIcon /> : <OutlineHeartIcon />}
            onClick={() => {
              if (onFavoriteChange) onFavoriteChange(!isFavorite);
            }}
          />
        </div>
        <FoodPrice
          currency="$"
          defaultPrice={sortedPriceList[0]}
          secondPrice={sortedPriceList[sortedPriceList.length - 1]}
        />

        <div className={cn("flex items-center")}>
          <FoodRating
            rating={food.rating}
            className={cn("mt-2", food.rating === 0 && "hidden")}
          />
          {food.tags.map((tag) => {
            return <Tag key={tag} name={tag} />;
          })}
        </div>
      </div>
    </div>
  );
}

const Tag = ({ name }: { name: string }) => (
  <span className="hover:cursor-pointer hover:bg-slate-500 hover:text-slate-200 rounded-md font-semibold bg-slate-200 px-2 py-1 text-gray-700 font-hairline text-xs ml-1">
    {name}
  </span>
);
