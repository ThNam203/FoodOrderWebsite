import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import Image from "next/image";

const FoodRating = ({
  rating,
  className,
}: {
  rating: number;
  className?: ClassValue;
}) => {
  return (
    <div className={cn("flex flex-row items-center select-none", className)}>
      {rating}
      <Image src={"/svgs/star.svg"} width={24} height={24} alt="star" />
    </div>
  );
};

export default FoodRating;
