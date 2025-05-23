
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, LayoutDashboard, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Waitlist from "./ui/waitlist-modal";

const NavbarDashboard = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const router = useRouter();
  
  // Wagmi hooks
  const { isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

 

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Toggle waitlist modal
  const toggleWaitlist = () => {
    setShowWaitlist(!showWaitlist);
  };

  const closeWaitlist = () => {
    setShowWaitlist(false);
  };

  

  const navLinkClass = "relative hover:text-[#FF7171] transition-colors duration-200 cursor-pointer after:block after:h-[2px] after:bg-[#FF7171] after:absolute after:-bottom-1 after:left-0 after:w-0 hover:after:w-full after:transition-all after:duration-300";

  return (
    <>
      {showWaitlist && <Waitlist close={closeWaitlist} />}
      
      <header className="w-full px-6 py-4 flex items-center justify-between bg-white dark:bg-[#0B0B0F] backdrop-blur-md z-50 transition-colors duration-300">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image src="/Subtract.png" alt="Raise3 Logo" width={28} height={28} />
            <span className="text-xl font-semibold text-black dark:text-white font-krona">Raise3</span>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-black dark:text-white"
            onClick={toggleMobileMenu}
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-black dark:text-white relative font-krona">
           
              
              
                <a 
                  
                  href={"/dashboard"} 
                  className={navLinkClass}
                >
                  Dashboard
                </a>
            
          </nav>

          {/* Theme Toggle, Waitlist, and Wallet Button */}
          <div className="hidden md:flex items-center gap-4">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-black dark:text-white bg-gray-200 dark:bg-black/30 hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            

            {isConnected && (
              <button
                className="px-4 py-2 text-sm text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
            )}

            {/* RainbowKit Connect Button */}
            <div className="flex items-center">
              <ConnectButton />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-white dark:bg-[#0B0B0F] pt-20 px-6 overflow-y-auto">
            <nav className="flex flex-col gap-4 text-lg text-black dark:text-white">
             
                <div  className="border-b border-gray-200 dark:border-gray-800 pb-3">
                 
                    <>
                      <div 
                        className="flex justify-between items-center mb-2"
                      >
                        <span>Dashboard</span>
                        
                      </div>
                      
                    </>
                
                    <a href={"/dashboard"} className="block">
                    Dashboard
                    </a>
                  
                </div>
              
              
              <div className="mt-4 space-y-3">
                <button
                  onClick={toggleWaitlist}
                  className="w-full px-4 py-2 text-center text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Join Waitlist
                </button>
                
                {isConnected && (
                  <button
                    // onClik={() => router.push('/dashboard')}
                    className="w-full px-4 py-2 text-center text-white bg-purple-600 rounded-md hover:bg-purple-700 flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </button>
                )}
                
                <div className="w-full">
                  <ConnectButton />
                </div>
                
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-black dark:text-white bg-gray-200 dark:bg-gray-800 rounded-md"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun size={18} /> Light Mode
                    </>
                  ) : (
                    <>
                      <Moon size={18} /> Dark Mode
                    </>
                  )}
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default NavbarDashboard;