// app/admin/layout.tsx
"use client";  // Ensures it runs on the client-side

import { useState } from "react";
import Sidebar from "./components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex h-screen">   
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />    
      <main
        className={`transition-all duration-300 ease-in-out flex-1 bg-gray-100 p-6 overflow-auto ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`} 
      >
        {children} {/* The actual content, passed as children */}
      </main>
    </div>
  );
}
