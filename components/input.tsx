"use client";
import { cn } from "@/utils/cn";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { ClassValue } from "clsx";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { SearchIcon } from "./icons";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessages?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, name, id, placeholder, label, errorMessages, ...props },
    ref
  ) => {
    return (
      <div className="w-full relative flex flex-col">
        <label
          htmlFor={id}
          className={cn(
            "font-bold cursor-pointer mb-2 text-secondaryWord text-sm",
            label ? "" : "hidden"
          )}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
          className={cn(
            "w-full border-0 outline outline-2 outline-secondaryWord rounded py-2 px-3 focus:outline-primary font-normal",
            errorMessages ? "outline-red-500" : "",
            className
          )}
          {...props}
        />
        <span className="absolute -bottom-5 text-red-500 text-xs">
          {errorMessages ? errorMessages : ""}
        </span>
      </div>
    );
  }
);
Input.displayName = "Input";

const SearchInput = ({
  id,
  type = "text",
  popoverPosition = "bottom",
  popoverContent,
  placeholder,
  className,
}: {
  id?: string;
  type?: string;
  popoverPosition?: "bottom-start" | "bottom-end" | "bottom";
  popoverContent?: ReactNode;
  placeholder?: string;
  className?: ClassValue;
}) => {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <Popover
      isOpen={showPopover}
      onOpenChange={setShowPopover}
      placement={popoverPosition}
      showArrow={true}
    >
      <PopoverTrigger>
        <div className={cn("relative flex flex-row items-center")}>
          <label
            htmlFor={id}
            className="absolute start-2 cursor-pointer font-normal"
          >
            <SearchIcon />
          </label>
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            className={cn(
              "border-0 outline outline-1 outline-black rounded py-1 px-10 focus:outline-4 focus:outline-primary",
              className
            )}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-white shadow-primaryShadow">
        <div
          className="max-h-[250px] overflow-y-scroll"
          onClick={() => setShowPopover(!showPopover)}
        >
          {popoverContent}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { Input, SearchInput };
