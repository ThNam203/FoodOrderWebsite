"use client";
import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { ReactNode, use, useEffect, useState } from "react";

const Tab = ({
  className,
  content,
  selectedTab,
  setSelectedTab,
  onClick,
}: {
  className?: ClassValue;
  content: string;
  selectedTab?: string;
  setSelectedTab: (selectedTab: string) => void;
  onClick?: () => void;
}) => {
  const selectedTabStyle = "text-primary bg-primary/20";
  const defaultTabStyle = "text-primaryWord bg-white";

  return (
    <span
      className={cn(
        "py-1 px-4 rounded-md hover:text-primary ease-linear duration-100 cursor-pointer",
        selectedTab === content ? selectedTabStyle : defaultTabStyle,
        className
      )}
      onClick={() => {
        setSelectedTab(content);
        if (onClick) onClick();
      }}
    >
      {content}
    </span>
  );
};

const TabContent = ({
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
      className={cn(
        "",
        selectedTab === contentFor ? "visible" : "hidden",
        className
      )}
    >
      {content}
    </div>
  );
};

export { Tab, TabContent };
