import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "YuvaKart - Smart Shopping, Easy Living",
  description: "Your trusted eCommerce platform for rural and semi-urban India",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
