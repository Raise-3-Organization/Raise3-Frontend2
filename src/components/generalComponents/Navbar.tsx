"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, LayoutDashboard, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Waitlist from "../ui/waitlist-modal";

const Navbar = () => {
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

  const handleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
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

  const navItems = [
    { 
      label: "About us", 
      items: ["Our Story", "Team", "Careers"],
      href: "#about"
    },
    { 
      label: "For Founders", 
      items: ["Raise Capital", "Launch Campaign"],
      href: "#founders"
    },
    { 
      label: "For Investors", 
      items: ["Browse Projects", "Investor Dashboard"],
      href: "#investors"
    },
    { 
      label: "Features", 
      href: "#features"
    },
    { 
      label: "FAQs", 
      href: "#faqs"
    },
    {
      label: "API Demo",
      href: "/api-demo"
    }
  ];

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
            {navItems.map((item) => (
              item.items ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <div className={`${navLinkClass} flex items-center gap-1`}>
                    {item.label}
                    <ChevronDown size={14} />
                  </div>

                  {openDropdown === item.label && (
                    <div className="absolute top-full mt-3 w-48 rounded-md bg-white dark:bg-[#1c1c24] shadow-xl py-2 z-40 animate-fade-in">
                      {item.items.map((subItem) => (
                        <a
                          key={subItem}
                          href={`${item.href}/${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[#2c2c34] transition-colors"
                        >
                          {subItem}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a 
                  key={item.label} 
                  href={item.href} 
                  className={navLinkClass}
                >
                  {item.label}
                </a>
              )
            ))}
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

            <button
              onClick={toggleWaitlist}
              className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors"
            >
              Join Waitlist
            </button>

            {isConnected && (
              <button
                onClick={() => router.push('/dashboard')}
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
              {navItems.map((item) => (
                <div key={item.label} className="border-b border-gray-200 dark:border-gray-800 pb-3">
                  {item.items ? (
                    <>
                      <div 
                        className="flex justify-between items-center mb-2"
                        onClick={() => handleDropdown(item.label)}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          size={20}
                          className={`transform transition-transform ${
                            openDropdown === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      {openDropdown === item.label && (
                        <div className="ml-4 flex flex-col gap-2 mt-2">
                          {item.items.map((subItem) => (
                            <a
                              key={subItem}
                              href={`${item.href}/${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                            >
                              {subItem}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a href={item.href} className="block">
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
              
              <div className="mt-4 space-y-3">
                <button
                  onClick={toggleWaitlist}
                  className="w-full px-4 py-2 text-center text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Join Waitlist
                </button>
                
                {isConnected && (
                  <button
                    onClick={() => router.push('/dashboard')}
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

export default Navbar;