"use client";

import "./globals.css";
import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()

  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <html lang="en">
      <body className="bg-gray-100">
        {!isAdminPage && <Navbar />}

        {/* Main Content Container */}
        
        {!isAdminPage && (
          <div className="max-w-screen-lg mx-auto px-4 py-8">
          {children}
        </div>
        )}

        {isAdminPage && (
          <>
          {children}
          </>
        )}

       {!isAdminPage && <Footer />}
       <Toaster/>
      </body>
    </html>
  );
}
