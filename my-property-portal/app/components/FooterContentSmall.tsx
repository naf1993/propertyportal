"use client";
import React from "react";
import { AiOutlineHeart, AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { BsCart } from "react-icons/bs";
import Link from "next/link";
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
    <div className="bg-blue-600 flex items-center fixed bottom-0 left-0 right-0 z-50 mt-10 p-0">
      <button
        className={`border-0 text-white px-3 py-5 rounded-sm bg-transparent w-full flex items-center justify-center ${isHome ? "active" : ""}`}
        onClick={() => router.push("/")}
      >
        <AiOutlineHome className="w-5 h-5" />
      </button>

      {isAuthenticated && (
        <button
          className={`${isUser ? "active" : ""}`}
          onClick={() => router.push("/account")}
        >
          <AiOutlineUser />
        </button>
      )}
      {!isAuthenticated && (
        <button
          className={`border-0 px-4 py-5 text-white  rounded-md bg-transparent w-full flex items-center justify-center footer-container-smbtn ${isUser ? "active" : ""}`}
          onClick={() => router.push("/login")}
        >
          <AiOutlineUser className="w-5 h-5"/>
        </button>
      )}
    </div>
  );
};

export default FooterContentSmallScreen;
