"use client";
import React, { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ClassValue } from "clsx";
import { cn } from "@/utils/cn";
import { TextButton } from "../buttons";
import { ChevronLeft, ChevronRight, Circle, Dot } from "lucide-react";
import { useDotButton } from "./carousel_dot_button";

export type CarouselItem = {
  id: number;
  name: string;
  image: string;
  quantity: number;
};

export default function CategoryCarousel({
  carouselItems,
  className,
}: {
  carouselItems: CarouselItem[];
  className?: ClassValue;
}) {
  const [emblaRef, emplaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000 }),
  ]);
  // const { selectedIndex, scrollSnaps, onDotButtonClick } =
  //   useDotButton(emplaApi);
  const [selectedCategory, setSelectedCategory] = useState<number>();

  return (
    <div className={cn("relative group", className)}>
      <TextButton
        iconBefore={<ChevronLeft className="text-white" />}
        className={cn(
          "absolute h-full left-0 top-0 opacity-0 group-hover:opacity-100 bg-transparent hover:bg-gray-50/20 hover:opacity-100 rounded-none z-50",

          carouselItems.length === 1 ? "hidden" : ""
        )}
        onClick={() => {
          if (emplaApi) emplaApi.scrollPrev();
        }}
      />
      <TextButton
        iconBefore={<ChevronRight className="text-white" />}
        className={cn(
          "absolute h-full right-0 top-0 opacity-0 group-hover:opacity-100 bg-transparent hover:bg-gray-50/20 hover:opacity-100 rounded-none z-50",
          carouselItems.length === 1 ? "hidden" : ""
        )}
        onClick={() => {
          if (emplaApi) emplaApi.scrollNext();
        }}
      />
      <div className="overflow-hidden rounded-md" ref={emblaRef}>
        <div className="flex items-center">
          {carouselItems.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => setSelectedCategory(item.id)}
                className={cn(
                  "rounded-md p-2 grid grid-cols-3 grid-rows-2 gap-2 shadow-xl cursor-pointer transition-colors duration-500 ease-in-out h-16 min-w-40",
                  selectedCategory === item.id ? "bg-primary" : ""
                )}
              >
                <div className="rounded-full flex items-center justify-center bg-white row-span-2">
                  <img className="h-8 w-8" src={item.image} alt="" />
                </div>
                <p className="font-bold text-xs col-span-2 text-ellipsis whitespace-nowrap overflow-hidden">
                  {item.name}
                </p>
                <p className="text-xs text-slate-400 col-span-2 text-ellipsis whitespace-nowrap overflow-hidden">
                  {item.quantity} dishes
                </p>
              </div>
            );
          })}
        </div>
      </div>
      {/* <div className="absolute w-full bottom-4 flex flex-row items-center bg-red-200 z-50">
        {scrollSnaps.map((snap, index) => {
          return (
            <TextButton
              key={index}
              className={cn(
                "w-2 h-2 rounded-full bg-transparent",
                selectedIndex === index ? "" : ""
              )}
              onClick={() => onDotButtonClick(index)}
              iconBefore={<Circle className="text-gray-400" />}
            />
          );
        })}
      </div> */}
    </div>
  );
}
