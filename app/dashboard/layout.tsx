"use client";

import Sidebar from "@/components/sidebar";
import "@/styles/globals.css";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <html lang="en">
      <body
        className={cn(
          "font-sans transition-[0.5] scrollbar",
          isSidebarOpen ? "ml-[calc(92px+6rem)]" : "ml-[92px]"
        )}
      >
        <Sidebar
          intitalState={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen((prevState) => !prevState)}
        />
        Children
      </body>
    </html>
  );
}
