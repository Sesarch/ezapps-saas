import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EZ Apps - E-commerce Tools for Shopify",
  description: "Powerful inventory management, BOM tracking, and more for your Shopify store",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  themeColor: '#F5DF4D',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta name="theme-color" content="#F5DF4D" />
      </head>
      <body className={`${inter.className} bg-[#F0EEE9]`}>{children}</body>
    </html>
  );
}
