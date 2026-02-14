import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // Import the professional footer

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EZ Apps | Enterprise E-commerce Solutions",
  description: "Unified ERP and CRM infrastructure for global Shopify merchants.",
  icons: {
    // Points to your uploaded favicon.png in /public
    icon: '/favicon.png', 
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased text-slate-900 bg-white`}>
        <AuthProvider>
          <Navbar />
          {/* Main content area */}
          <main className="min-h-screen">
            {children}
          </main>
          {/* Footer is now global and shows on all pages */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
