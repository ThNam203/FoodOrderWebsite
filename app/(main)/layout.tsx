"use client";

import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "@/styles/globals.css";
import Sidebar from "@/components/sidebar";
import { useEffect, useRef, useState } from "react";
import { Toast } from "@/components/toast";
import { cn } from "@/utils/cn";
import { getCookie, setCookie } from "cookies-next";

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
});

// export const metadata: Metadata = {
//   title: "Fooddddddd",
//   description: "Food selling website",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    localStorage.getItem("sidebarState") === "true" ? true : false
  );
  const handleSidebarToggle = () => {
    localStorage.setItem("sidebarState", isSidebarOpen ? "false" : "true");
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <html lang="en">
      <body
        className={cn(
          lato.variable,
          "min-h-screen bg-white font-sans transition-[0.5] scrollbar",
          isSidebarOpen ? "ml-[calc(92px+6rem)]" : "ml-[92px]"
        )}
      >
        <Sidebar
          intitalState={isSidebarOpen}
          onSidebarToggle={handleSidebarToggle}
        />
        {children}
        <Toast />
      </body>
    </html>
  );
}
