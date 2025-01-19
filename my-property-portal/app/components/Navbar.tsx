"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store"; // Import RootState type
import { logout } from "../slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth);
  const { isAuthenticated, user: authenticatedUser } = user;
  console.log(authenticatedUser);

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action to clear user and token
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="bg-primary-500 text-white sticky top-0 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="text-2xl font-semibold">
          <Link href="/">GoodHomes</Link>
        </div>

        {/* Menu visible on large screens */}
        <ul className="hidden lg:flex space-x-6">
          <li>
            <Link href="/about" className="text-white hover:text-primary-300">
              About
            </Link>
          </li>
          {!isAuthenticated && (
            <li>
              <Link
                href="/register"
                className="text-white hover:text-primary-300"
              >
                Register
              </Link>
            </li>
          )}
          {isAuthenticated && (
            <li className="relative">
              {/* User name with dropdown */}
              <button
                onClick={toggleDropdown}
                className="text-white hover:text-primary-300 flex items-center space-x-2"
              >
                <span>Welcome {authenticatedUser?.name}</span>
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm hover:bg-primary-500 hover:text-white"
                    >
                      Logout
                    </button>
                  </li>
                  <li>
                    <Link
                      href="/account"
                      className="block w-full px-4 py-2 text-sm hover:bg-primary-500 hover:text-white"
                    >
                      My Account
                    </Link>
                  </li>
                  {authenticatedUser?.role === "admin" && (
                    <li>
                      <Link
                        href="/admin"
                        className="block w-full px-4 py-2 text-sm hover:bg-primary-500 hover:text-white"
                      >
                        Admin
                      </Link>
                    </li>
                  )}

                  {authenticatedUser?.role === "agent" && (
                    <li>
                      <Link
                        href="/agent"
                        className="block w-full px-4 py-2 text-sm hover:bg-primary-500 hover:text-white"
                      >
                        Agent
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
