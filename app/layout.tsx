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
      <body className={twMerge(inter.className, "transition-[0.5] pr-16", isSidebarOpen ? "pl-[16rem]" : "pl-[6.75rem]")}>
        <Sidebar intitalState={isSidebarOpen} onSidebarToggle={() => setIsSidebarOpen(prevState => !prevState)}/>
        {children}
      </body>
    </html>
  );
}
