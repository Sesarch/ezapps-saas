import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar"; // 1. Import the Navbar

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EZ Apps - Enterprise E-commerce Solutions",
  description: "Unified ERP and CRM infrastructure for global Shopify merchants.",
  icons: {
    icon: '/favicon.png',
  },
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
      </head>
      {/* 2. Added 'antialiased' and 'text-slate-900' for that Corporate feel */}
      <body className={`${inter.className} antialiased text-slate-900 bg-white`}>
        <AuthProvider>
          {/* 3. Place Navbar here so it shows on all pages */}
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
