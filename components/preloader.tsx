"use client";
import preloaderStyle from "@/styles/preloader.module.css";
import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";

const Preloader = ({ className }: { className?: ClassValue }) => {
  return (
    <div className={cn(preloaderStyle["preloader"], "z-[999]", className)}>
      <svg
        viewBox="0 0 102 102"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-[150px] w-[150px]"
      >
        <path
          className={preloaderStyle["big-circle"]}
          d="M101 51C101 78.6142 78.6142 101 51 101C23.3858 101 1 78.6142 1 51"
          stroke="#252525"
          strokeWidth="2"
        />
        <path
          className={preloaderStyle["small-circle"]}
          d="M91 51C91 28.9086 73.0914 11 51 11C28.9086 11 11 28.9086 11 51"
          stroke="#252525"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default Preloader;
