'use client' // Added to allow path checking

import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Define pages where we want a "Clean" look with no distracting Navbar/Footer
  const isAuthPage = pathname === "/login" || pathname === "/superadmin";

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased text-slate-900 bg-white`}>
        <AuthProvider>
          {/* Only show Navbar if we are NOT on a secure login/admin page */}
          {!isAuthPage && <Navbar />}
          
          <main className="min-h-screen">
            {children}
          </main>
          
          {/* Only show Footer if we are NOT on a secure login/admin page */}
          {!isAuthPage && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}
