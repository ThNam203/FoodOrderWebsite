"use client";
import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import Image from "next/image";
import React, { ReactNode } from "react";
import img from "../public/images/bg-login-page.jpg";
import { Checkbox } from "@nextui-org/react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export interface IconButtonProps extends ButtonProps {
  icon: ReactNode;
}

export interface TextButtonProps extends ButtonProps {
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
}

export interface TagButtonProps extends ButtonProps {
  content: string;
}

export interface RoundedIconButtonProps extends ButtonProps {
  icon: ReactNode;
}

export interface PayMethodButtonProps extends ButtonProps {
  icon: ReactNode;
  selectedButton?: string;
  content: string;
}

export interface CollumnHeaderButtonProps extends TextButtonProps {
  canSort?: boolean;
}

export interface RoundedImageButtonProps extends ButtonProps {}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "w-8 h-8 hover:bg-hoverColor disabled:hover:bg-transparent disabled:text-secondaryWord rounded flex flex-row items-center justify-center",
          className
        )}
        {...props}
      >
        {icon}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

const TextButton = React.forwardRef<HTMLButtonElement, TextButtonProps>(
  ({ className, children, iconBefore, iconAfter, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "w-fit px-2 py-2 bg-primary text-white hover:opacity-60 disabled:opacity-60 rounded-md text-md font-bold flex flex-row items-center justify-center cursor-pointer disabled:cursor-default ease-linear duration-100",
          className
        )}
        {...props}
      >
        {iconBefore}
        {children}
        {iconAfter}
      </button>
    );
  }
);
TextButton.displayName = "TextButton";

const TagButton = React.forwardRef<HTMLButtonElement, TagButtonProps>(
  ({ className, content, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-2 py-1 bg-gray-200 hover:bg-hoverColor disabled:hover:bg-transparent rounded-xl text-xs font-semibold text-gray-500 flex flex-row items-center justify-center cursor-pointer",
          className
        )}
        {...props}
      >
        {content}
      </button>
    );
  }
);
TagButton.displayName = "TagButton";

const RoundedIconButton = React.forwardRef<
  HTMLButtonElement,
  RoundedIconButtonProps
>(({ className, icon, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "w-8 h-8 rounded-full flex flex-row items-center justify-center outline-none",
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
});
RoundedIconButton.displayName = "RoundedIconButton";

const RoundedImageButton = ({ className }: { className?: ClassValue }) => {
  return (
    <Image
      width={500}
      height={500}
      className={cn(
        "h-8 w-8 rounded-full overflow-hidden cursor-pointer",
        className
      )}
      src={img}
      alt="mrbeast"
    />
  );
};

const PayMethodButton = React.forwardRef<
  HTMLButtonElement,
  PayMethodButtonProps
>(({ className, content, selectedButton, icon, onClick, ...props }, ref) => {
  const selectedStyle = "bg-momoBgColor border-momoBorderColor";
  const defaultStyle = "bg-white border-borderColor";
  return (
    <button
      ref={ref}
      className={cn(
        "min-w-60 w-auto flex flex-row items-center justify-between px-4 py-2 gap-4 ease-linear duration-200 text-primaryWord border rounded-2xl text-md font-bold cursor-pointer disabled:cursor-default",
        selectedButton === content ? selectedStyle : defaultStyle,
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className="flex flex-row items-center gap-2">
        {icon}
        {content}
      </div>
      <Checkbox
        radius="full"
        color="danger"
        size="sm"
        isSelected={selectedButton === content}
      />
    </button>
  );
});
PayMethodButton.displayName = "PayMethodButton";

const CollumnHeaderButton = React.forwardRef<
  HTMLButtonElement,
  CollumnHeaderButtonProps
>(
  (
    { className, content, iconBefore, iconAfter, canSort = true, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "w-fit px-2 py-2 gap-2 outline-none border-0 whitespace-nowrap text-secondaryWord bg-white ease-linear duration-100 disabled:bg-gray-100/60 rounded-md flex flex-row items-center justify-center cursor-pointer disabled:cursor-default font-semibold",
          canSort ? "hover:bg-gray-100 select-none" : "",
          className
        )}
        {...props}
      >
        {iconBefore}
        {content}
        {iconAfter}
      </button>
    );
  }
);
CollumnHeaderButton.displayName = "CollumnHeaderButton";

export {
  IconButton,
  RoundedIconButton,
  RoundedImageButton,
  TagButton,
  TextButton,
  PayMethodButton,
  CollumnHeaderButton,
};
