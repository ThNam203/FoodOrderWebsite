import { cn } from "@/utils/cn";
import React from "react";

export interface LabelProps
  extends React.InputHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, htmlFor, ...props }, ref) => {
    return (
      <label
        ref={ref}
        htmlFor="htmlFor"
        className={cn("font-semibold cursor-pointer mb-2")}
        {...props}
      >
        {children}
      </label>
    );
  }
);
Label.displayName = "Label";
