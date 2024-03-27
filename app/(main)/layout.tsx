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
        "min-h-screen bg-white font-sans transition-[0.5] scrollbar ease-linear duration-300",
        isSidebarOpen ? "pl-[calc(92px+6rem)]" : "pl-[92px]"
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
      {children}
      <Toast />
    </div>
  );
}
