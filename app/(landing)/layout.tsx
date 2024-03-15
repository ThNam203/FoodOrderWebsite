import { Lato } from "next/font/google";
import "@/styles/globals.css";
import { Metadata } from "next";
import { Toast } from "@/components/toast";

export const metadata: Metadata = {
  title: "Fooddddddd",
  description: "Food selling website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-screen overflow-x-hidden">
        {children}
        <Toast />
      </body>
    </html>
  );
}
