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
}: {
  className?: ClassValue;
  tabNum: number;
  tabName: string;
  selectedTab: string;
  setSelectedTab: (selectedTab: string) => void;
  onClick?: () => void;
}) => {
  const currentNumStyle = "bg-primary";
  const currentStepStyle = "text-primaryWord";
  const defaultNumStyle = "bg-disableColor";
  const defaultStepStyle = "text-secondaryWord";
  return (
    <div className="flex flex-row items-center gap-2 select-none">
      <div
        className={cn(
          "w-6 h-6 flex items-center justify-center font-bold text-white rounded-full",
          selectedTab === tabName ? currentNumStyle : defaultNumStyle
        )}
      >
        {tabNum}
      </div>
      <span
        className={cn(
          "hover:text-primaryWord cursor-pointer font-semibold text-lg",
          selectedTab === tabName ? currentStepStyle : defaultStepStyle
        )}
        onClick={() => {
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
