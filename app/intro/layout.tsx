import { Lato } from "next/font/google";
import "@/styles/globals.css";
import { Metadata } from "next";
import { Toast } from "@/components/toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-screen overflow-x-hidden">{children}</div>;
}
