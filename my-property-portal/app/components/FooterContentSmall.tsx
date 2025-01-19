"use client";
import React from "react";
import { AiOutlineHeart, AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { BsCart } from "react-icons/bs";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { RootState } from '../store'; // Import RootState type

const FooterContentSmallScreen = () => {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth);
  const { isAuthenticated } = user;
  const router = useRouter(); // Make sure to import this from 'next/navigation'

  const isHome = pathname === "/";
  const isUser = pathname === "/account";
  const isCart = pathname === "/cart";
  const isFav = pathname === "/favourites";

  return (
    <div className="bg-blue-950 flex items-center fixed bottom-0 left-0 right-0 z-50 mt-15 p-0">
      {/* Home Button */}
      <button
        className={`border-0 text-white px-3 py-4 rounded-sm w-full flex items-center justify-center ${
          isHome
            ? "bg-blue-200 text-white" // Active state background and text color
            : "hover:bg-blue-200 text-white"
        }`}
        onClick={() => router.push("/")}
      >
        <AiOutlineHome className="w-5 h-5" />
      </button>

      {/* User Button (Authenticated) */}
      {isAuthenticated && (
        <button
          className={`border-0 text-white px-3 py-4 rounded-sm w-full flex items-center justify-center ${
            isUser
              ? "bg-blue-200 text-white" // Active state background and text color
              : "hover:bg-blue-200 hover:text-white"
          }`}
          onClick={() => router.push("/account")}
        >
          <AiOutlineUser className="w-5 h-5" />
        </button>
      )}

      {/* User Button (Not Authenticated) */}
      {!isAuthenticated && (
        <button
          className={`border-0 text-white px-3 py-5 rounded-sm w-full flex items-center justify-center ${
            isUser
              ? "bg-blue-800 text-yellow-300" // Active state background and text color
              : "hover:bg-blue-700 hover:text-yellow-400"
          }`}
          onClick={() => router.push("/login")}
        >
          <AiOutlineUser className="w-5 h-5" />
        </button>
      )}

     

     
    </div>
  );
};

export default FooterContentSmallScreen;
