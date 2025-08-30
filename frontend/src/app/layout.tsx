import "./globals.css";
import type { Metadata } from "next";
import CartProvider from "@/app/context/cartContext";

export const metadata: Metadata = {
  title: "TechXChange",
  description: "Marketplace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}