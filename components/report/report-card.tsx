import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import React, { FC } from "react";
import { motion } from "framer-motion";

interface ReportCardProps {
  children?: React.ReactNode;
  className?: ClassValue;
}
const ReportCard: FC<ReportCardProps> = ({ children, className }) => {
  return (
    <motion.div
      className={cn(
        "w-full h-full font-sans bg-white rounded-lg shadow-primaryShadow p-4 text-primaryWord font-semibold ease-linear duration-300 transition-all",
        className
      )}
      whileHover={{
        boxShadow:
          "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      }}
    >
      {children}
    </motion.div>
  );
};

export default ReportCard;
