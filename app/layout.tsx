"use client";

import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "@/styles/globals.css";
import Sidebar from "@/components/sidebar";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

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
  return (
    <html lang="en">
      <body className={lato.variable}>{children}</body>
    </html>
  );
}
