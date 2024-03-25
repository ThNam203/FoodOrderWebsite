"use client";

import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "@/styles/globals.css";
import Sidebar from "@/components/sidebar";
import { use, useEffect, useRef, useState } from "react";
import { Toast } from "@/components/toast";
import { cn } from "@/utils/cn";
import { getCookie, setCookie } from "cookies-next";

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
        "min-h-screen bg-white font-sans transition-[0.5] scrollbar ease-linear duration-100",
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
