"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-primary-500 text-white sticky top-0 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="text-2xl font-semibold">
          <Link href="/">GoodHomes</Link>
        </div>

      
       
      </div>
    </nav>
  );
};

export default Navbar;
