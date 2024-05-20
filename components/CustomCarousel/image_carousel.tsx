"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ClassValue } from "clsx";
import { cn } from "@/utils/cn";
import { TextButton } from "../buttons";
import { ChevronLeft, ChevronRight, Circle, Dot } from "lucide-react";
import { useDotButton } from "./carousel_dot_button";
import Image from "next/image";

export type CarouselItem = {
  image: string;
};

export default function ImageCarousel({
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
                style={{
                  backgroundImage: `url(${item.image})`,
                }}
                className={cn(
                  "flex-0_0_100",
                  "h-48 bg-center bg-cover bg-no-repeat relative"
                )}
              />
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
