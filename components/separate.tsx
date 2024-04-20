import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";

export type SeparateType = "horizontal" | "vertical";
const Separate = ({
  classname,
  separateType = "horizontal",
}: {
  classname?: ClassValue;
  separateType?: SeparateType;
}) => {
  if (separateType === "horizontal")
    return (
      <div className={cn("h-[0.5px] bg-gray-200 w-full", classname)}></div>
    );
  else
    return (
      <div className={cn("w-[0.5px] bg-gray-200 h-full", classname)}></div>
    );
};

export { Separate };
