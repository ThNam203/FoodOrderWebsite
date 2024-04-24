import { Lato } from "next/font/google";
import "@/styles/globals.css";
import { Metadata } from "next";
import { Toast } from "@/components/toast";

export const metadata: Metadata = {
  title: "Free Food",
  description: "Food selling website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-screen overflow-x-hidden">{children}</div>;
}
