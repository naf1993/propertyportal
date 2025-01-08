"use client";
import { FaHome ,FaTachometerAlt} from "react-icons/fa"; // Dashboard icon
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for the toggle button
import Link from "next/link";
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div className="relative">
      {/* Mobile Toggle Button */}
      <button
        className="absolute top-4 left-4 md:hidden text-white z-50"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar Content */}
      <div
        className={`transition-all duration-300 ease-in-out fixed md:relative top-0 left-0 z-40 h-full bg-gray-800 text-white w-64 md:w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-4  text-xl font-bold">
          <Link href="/admin" className="text-white flex items-center">
            <FaTachometerAlt className="inline-block mr-2" />
            Dashboard
          </Link>
        </div>

        <nav className="mt-8">
          <ul className="space-y-4 px-4">
            <li>
              <Link href="/admin" className="text-white uppercase tracking-wide">
              <FaHome className="inline-block mr-2 text-md" />
               <span className="text-sm">Properties</span> 
              </Link>
            </li>
          
            {/* Add more navigation links as needed */}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
