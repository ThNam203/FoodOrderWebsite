import LayoutLoader from "@/components/layout_loader";
import { ScrollArea } from "@/components/scroll-area";
import { Toast } from "@/components/toast";
import ReduxProvider from "@/redux/provider";
import "@/styles/globals.css";
import { cn } from "@/utils/cn";
import { Lato } from "next/font/google";

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
      <body className={cn(lato.variable, "overflow-hidden")}>
        <ReduxProvider>
          <LayoutLoader>{children}</LayoutLoader>
        </ReduxProvider>
        <Toast />
      </body>
    </html>
  );
}
