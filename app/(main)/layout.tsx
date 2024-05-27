"use client";

import Sidebar from "@/components/sidebar";
import { Toast } from "@/components/toast";
import "@/styles/globals.css";
import { cn } from "@/utils/cn";
import { Lato } from "next/font/google";
import { useState } from "react";

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    localStorage.getItem("sidebarState") === "true" ? true : false
  );

  return (
    <div
      className={cn(
        "min-h-screen w-full bg-transparent font-sans flex flex-row justify-end"
      )}
    >
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => {
          localStorage.setItem(
            "sidebarState",
            !isSidebarOpen ? "true" : "false"
          );
          setIsSidebarOpen(!isSidebarOpen);
        }}
      />
      <div
        className={cn(
          "relative flex-1 transition-[0.5] ease-linear duration-300",
          "max-sm:w-[calc(100%-92px)]"
        )}
      >
        {children}
      </div>
    </div>
  );
}
