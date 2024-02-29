'use client'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Sidebar from "@/components/sidebar";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={twMerge(inter.className, "transition-[0.5] scrollbar", isSidebarOpen ? "ml-[calc(92px+6rem)]" : "ml-[92px]")}>
        <Sidebar intitalState={isSidebarOpen} onSidebarToggle={() => setIsSidebarOpen(prevState => !prevState)}/>
        {children}
      </body>
    </html>
  );
}
