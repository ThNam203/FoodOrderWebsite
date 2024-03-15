import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";

const Separate = ({ classname }: { classname?: ClassValue }) => {
  return <div className={cn("h-[0.5px] bg-gray-200 w-full", classname)}></div>;
};

export { Separate };
