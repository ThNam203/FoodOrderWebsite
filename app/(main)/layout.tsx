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
