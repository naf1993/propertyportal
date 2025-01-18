"use client";
import { useState, useEffect } from "react";
import FooterContentSmallScreen from "./FooterContentSmall";

const Footer = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 500);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
   <>
      {isSmallScreen ? (
        <FooterContentSmallScreen />
      ) : (
        <div className="bg-blue-950 text-white py-6 mt-8">
          <div className="text-center">
            <p>© {new Date().getFullYear()} Good Homes. All Rights Reserved.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
