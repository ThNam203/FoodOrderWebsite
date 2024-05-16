import { mapRange } from "@/utils/func";
import { ClassValue } from "clsx";
import React, { FC, useRef, useState, useEffect } from "react";
import {
  MotionValue,
  Variant,
  motion,
  stagger,
  useMotionValue,
} from "framer-motion";
import { cn } from "@/utils/cn";

interface InitMotionWrapperProps {
  children: React.ReactNode;
  className?: ClassValue;
  variants?: any;
  initial?: any;
  animate?: any;
  hasHoverEffect?: boolean;
}

const MotionWrapper: FC<InitMotionWrapperProps> = ({
  children,
  className,
  hasHoverEffect = true,
  variants,
  initial,
  animate,
}) => {
  const setTransform = (
    item: HTMLElement & EventTarget,
    event: PointerEvent,
    x: MotionValue,
    y: MotionValue
  ) => {
    const bounds = item.getBoundingClientRect();
    const relativeX = event.clientX - bounds.left;
    const relativeY = event.clientY - bounds.top;
    const xRange = mapRange(0, bounds.width, -1, 1)(relativeX);
    const yRange = mapRange(0, bounds.height, -1, 1)(relativeY);
    x.set(xRange * 20);
    y.set(yRange * 20);
  };

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <motion.div
      className={cn("", className)}
      variants={variants}
      initial={initial}
      animate={animate}
      style={{ x, y }}
      onMouseDown={() => {}}
      onPointerMove={(e: any) => {
        if (!hasHoverEffect) return;
        const item = e.currentTarget;
        setTransform(item, e, x, y);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      transition={{ type: "spring", stiffness: 100, damping: 10, mass: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
