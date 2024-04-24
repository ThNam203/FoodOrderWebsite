import Image from "next/image";
import { twMerge } from "tailwind-merge";
import FoodRating from "./food_rating";
import { Food } from "@/models/Food";
import { FoodPrice } from "./food_price";
import { IconButton } from "./buttons";
import { cn } from "@/utils/cn";
import { HeartIcon, OutlineHeartIcon } from "./icons";

export default function MainPageItem({
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
        "rounded overflow-hidden shadow-lg bg-[#12192C] bg-opacity-75 p-0",
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
          currency="đ"
          defaultPrice={sortedPriceList[0]}
          secondPrice={sortedPriceList[1]}
        />
        <div className="flex items-center">
          <FoodRating rating={food.rating} className="mt-2" />
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
