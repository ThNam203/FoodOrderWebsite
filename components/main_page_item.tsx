import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default function MainPageItem({
  food,
  className,
}: {
  food: any;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "rounded overflow-hidden shadow-lg bg-[#12192C] bg-opacity-75 p-0",
        className,
      )}
    >
      <div
        className="relative shadow-lg h-40"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${food.image})`,
        }}
      >
        <div className="absolute left-1 top-1 bg-red-500 rounded-md p-2 text-center text-xs w-max">
          <span className="font-bold">{food.prepTimeValue}</span>{" "}
          {food.prepTimeUnit}
        </div>
      </div>
      <div className="flex flex-col m-2 gap-2">
        <p className="text-base">{food.title}</p>
        <p className="text-xl">$9.99</p>
        <div className="flex items-center">
          <div className="flex flex-row">
            {food.rating}
            <Image
              src={"/svgs/star.svg"}
              width={24}
              height={24}
              alt="dish image"
            />
          </div>
          <Tag name={food.cat1} />
          <Tag name={food.cat2} />
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
