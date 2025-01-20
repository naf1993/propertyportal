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
   {isSmallScreen && (<FooterContentSmallScreen/>)}
  
    </>
  );
};

export default Footer;
