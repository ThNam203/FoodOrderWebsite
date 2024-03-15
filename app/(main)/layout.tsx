"use client";

import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "@/styles/globals.css";
import Sidebar from "@/components/sidebar";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { Toast } from "@/components/toast";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <html lang="en">
      <body
        className={twMerge(
          lato.variable,
          "min-h-screen bg-white font-sans transition-[0.5] scrollbar",
          isSidebarOpen ? "ml-[calc(92px+6rem)]" : "ml-[92px]"
        )}
      >
        <Sidebar
          intitalState={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen((prevState) => !prevState)}
        />
        {children}
        <Toast />
      </body>
    </html>
  );
}
