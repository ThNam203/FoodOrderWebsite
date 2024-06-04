"use client";
import React, { FC } from "react";
import ReportCard from "../report-card";
import { Food, FoodSize } from "@/models/Food";
import Image from "next/image";
import { FoodReportData, MonthlyFoodReportData } from "@/models/Report";
import { ClassValue } from "clsx";
import { cn } from "@/utils/cn";
import { displayNumber } from "@/utils/func";

interface TrendingFoodProps {
  data: FoodReportData[] | undefined;
  className?: ClassValue;
}
const TrendingFood: FC<TrendingFoodProps> = ({ data, className }) => {
  return (
    <ReportCard className={cn("h-full flex flex-col gap-2", className)}>
      <span className="font-semibold text-primaryWord text-xl">
        Trending foods
      </span>
      <HeaderRow />
      <div className="h-[400px] flex flex-col gap-2 overflow-y-scroll scrollbar scrollbar-hide">
        {data &&
          data.map((item, idx) => (
            <FoodRow key={idx} food={item.food} count={item.quantity} />
          ))}
      </div>
    </ReportCard>
  );
};

const HeaderRow = () => {
  return (
    <div className="bg-purple-100 rounded-md flex flex-row justify-between py-3 px-4">
      <span>Food name</span>
      <span>Orders</span>
    </div>
  );
};

const FoodRow = ({ food, count }: { food: Food; count: number }) => {
  let formattedPrice;
  if (food.foodSizes.length === 1) {
    formattedPrice = displayNumber(food.foodSizes[0].price, "$");
  } else if (food.foodSizes.length > 1) {
    //find min and max price
    let minPrice = food.foodSizes[0].price;
    let maxPrice = food.foodSizes[0].price;
    food.foodSizes.forEach((foodSize) => {
      if (foodSize.price < minPrice) minPrice = foodSize.price;
      if (foodSize.price > maxPrice) maxPrice = foodSize.price;
    });
    formattedPrice =
      displayNumber(minPrice, "$") + " - " + displayNumber(maxPrice, "$");
  }
  return (
    <div className="rounded-md bg-white hover:bg-white/10 flex flex-row justify-between py-3 pr-4 text-primaryWord">
      <div className="flex flex-row gap-4">
        <Image
          src={food.images[0]}
          width={50}
          height={50}
          alt={food.name}
          className="rounded-md object-cover"
        />
        <div className="flex-1">
          <div className="flex flex-col">
            <span className="font-semibold">{food.name}</span>
            <span className="text-secondaryWord">{formattedPrice}</span>
          </div>
        </div>
      </div>
      <span className="text-secondaryWord">{count}</span>
    </div>
  );
};

export default TrendingFood;
