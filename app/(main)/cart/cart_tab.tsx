"use client";
import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { ReactNode } from "react";

const CartTab = ({
  className,
  tabNum,
  tabName,
  selectedTab,
  setSelectedTab,
  onClick,
  disabled = false,
}: {
  className?: ClassValue;
  tabNum: number;
  tabName: string;
  selectedTab: string;
  setSelectedTab: (selectedTab: string) => void;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const currentNumStyle = "bg-primary";
  const currentStepStyle = "text-primaryWord";
  const defaultNumStyle = "bg-disableColor";
  const defaultStepStyle = "text-secondaryWord";
  return (
    <div
      className={cn(
        "flex flex-row items-center gap-2 select-none",
        disabled ? "select-none" : "",
        className
      )}
    >
      <div
        className={cn(
          "w-6 h-6 flex items-center justify-center font-bold text-white rounded-full shrink-0",
          selectedTab === tabName ? currentNumStyle : defaultNumStyle
        )}
      >
        {tabNum}
      </div>
      <span
        className={cn(
          "cursor-pointer font-semibold text-lg whitespace-nowrap",
          disabled ? "cursor-default" : "hover:text-primaryWord",
          selectedTab === tabName ? currentStepStyle : defaultStepStyle
        )}
        onClick={() => {
          if (disabled) return;
          setSelectedTab(tabName);
          if (onClick) onClick();
        }}
      >
        {tabName}
      </span>
    </div>
  );
};

const CartContent = ({
  className,
  contentFor,
  content,
  selectedTab,
}: {
  className?: ClassValue;
  contentFor?: string;
  content: ReactNode;
  selectedTab?: string;
}) => {
  return (
    <div
      className={cn("", selectedTab === contentFor ? "" : "!hidden", className)}
    >
      {content}
    </div>
  );
};

export { CartTab, CartContent };
