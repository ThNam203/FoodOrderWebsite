import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import {
  MoveRight,
  TrendingDown,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import React, { FC, ReactNode } from "react";
import { RoundedIconButton } from "../buttons";
import { displayNumber } from "@/utils/func";

interface ReportCompareCardProps {
  children?: React.ReactNode;
  className?: ClassValue;
  title: string;
  valueOffset: number;
  value: number;
  unit: "$" | "order" | "orders" | "%" | string;
  hasSpace?: boolean;
  isInvertColor?: boolean;
  icon?: ReactNode;
}
const ReportCompareCard: FC<ReportCompareCardProps> = ({
  value,
  unit,
  className,
  title,
  valueOffset,
  isInvertColor = false,
  hasSpace = false,
  icon,
}) => {
  return (
    <div
      className={cn(
        "border rounded-md p-4 flex flex-col gap-6 text-primaryWord",
        className
      )}
    >
      <div className="flex flex-row">
        <div className="flex-1">
          <span className="font-semibold text-xl">{title}</span>
        </div>
        {icon && (
          <RoundedIconButton
            className="w-10 h-10 bg-blue-500 justify-self-end"
            icon={icon}
          />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex-1 text-secondaryWord text-xl font-semibold">
          {displayNumber(unit !== "%" ? value : value * 100, unit, hasSpace)}
        </div>
        <div
          className={cn(
            "flex flex-row gap-2 font-semibold",

            valueOffset > 0
              ? isInvertColor
                ? "text-red-500"
                : "text-green-500"
              : isInvertColor
              ? "text-green-500"
              : "text-red-500",
            valueOffset === 0 && "text-secondaryWord"
          )}
        >
          {valueOffset > 0 && <TrendingUpIcon />}
          {valueOffset === 0 && <MoveRight />}
          {valueOffset < 0 && <TrendingDownIcon />}
          {valueOffset >= 0 && "+"}
          {displayNumber(
            unit !== "%" ? valueOffset : valueOffset * 100,
            unit,
            hasSpace
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCompareCard;
