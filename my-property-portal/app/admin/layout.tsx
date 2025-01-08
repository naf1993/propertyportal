"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Pass isSidebarOpen state to Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ease-in-out flex-1 bg-gray-100 p-6 overflow-auto ${
          isSidebarOpen ? "ml-64" : "ml-0" // Add left margin when sidebar is open
        }`}
      >
        {children}
      </main>
    </div>
  );
}
