"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import "./globals.css";
import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isExludedRoute =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register");

  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
        <html lang="en">
          <body className="bg-gray-100">
            {!isExludedRoute && <Navbar />}

            {/* Main Content Container */}

            {!isExludedRoute && (
              <div className="max-w-screen-lg mx-auto px-4 py-8">
                {children}
              </div>
            )}

            {isExludedRoute && <>{children}</>}

            {!isExludedRoute && <Footer />}
            <Toaster />
          </body>
        </html>
      </GoogleOAuthProvider>
    </Provider>
  );
}
