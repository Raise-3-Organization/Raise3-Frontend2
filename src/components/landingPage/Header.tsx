"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Wallet, Moon, Sun, ChevronDown, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ConnectButton } from '../walletConnection/ConnectButton';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const walletButtonRef = useRef<HTMLDivElement>(null);
  
  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();

  useEffect(() => {
    setMounted(true);
    
    // Check if user previously disconnected
    const wasDisconnected = localStorage.getItem('raise3-wallet-disconnected') === 'true';
    if (wasDisconnected && isConnected) {
      // Automatically disconnect if the user had previously disconnected
      // but somehow got reconnected (browser refresh, etc.)
      console.log("Auto-disconnecting previously disconnected wallet");
      disconnectAsync().catch(error => {
        console.error("Error auto-disconnecting wallet:", error);
      });
    }
  }, [isConnected, disconnectAsync]);

  // Listen for connection state changes
  useEffect(() => {
    console.log("Connection state changed:", isConnected);
    if (!isConnected) {
      setConnecting(false);
      setShowWalletOptions(false);
      setDisconnecting(false);
    } else {
      // User is now connected, clear the disconnected flag
      localStorage.removeItem('raise3-wallet-disconnected');
      // Hide the connect wallet modal after connection
      setShowConnectWallet(false);
    }
  }, [isConnected]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (walletButtonRef.current && !walletButtonRef.current.contains(event.target as Node)) {
        setShowWalletOptions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [walletButtonRef]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleConnectWallet = () => {
    if (!isConnected) {
      // Show the connect wallet modal
      setShowConnectWallet(true);
    } else {
      // Toggle dropdown when connected
      setShowWalletOptions(!showWalletOptions);
    }
  };
  
  const handleDisconnect = async (e: React.MouseEvent) => {
    // Stop event propagation to prevent the dropdown from closing immediately
    e.stopPropagation();
    
    if (disconnecting) return; // Prevent multiple disconnection attempts
    
    console.log("Disconnecting wallet...");
    setDisconnecting(true);
    
    try {
      // Add the disconnection flag before attempting to disconnect
      localStorage.setItem('raise3-wallet-disconnected', 'true');
      
      // Call disconnectAsync and wait for it to complete
      await disconnectAsync();
      
      // Force close dropdown
      setShowWalletOptions(false);
      
      console.log("Wallet disconnected successfully");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      setDisconnecting(false);
    }
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const navLinkClass =
    "relative hover:text-[#FF7171] transition-colors duration-200 cursor-pointer after:block after:h-[2px] after:bg-[#FF7171] after:absolute after:-bottom-1 after:left-0 after:w-0 hover:after:w-full after:transition-all after:duration-300"

  return (
    <>
      {showConnectWallet && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-white dark:bg-[#1c1c24] p-8 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Connect Your Wallet</h3>
              <button 
                onClick={() => setShowConnectWallet(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
            {/* Using our custom ConnectButton with the brand gradient */}
            <div className="flex flex-col gap-4">
              <ConnectButton />
            </div>
          </div>
        </div>
      )}
      
      <header className="w-full px-6 py-4 flex items-center justify-between bg-white dark:bg-[#0B0B0F] backdrop-blur-md z-50 transition-colors duration-300">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image src="/Subtract.png" alt="Raise3 Logo" width={28} height={28} />
          <span className="text-xl font-semibold text-black dark:text-white font-krona">Raise3</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-black dark:text-white relative font-krona">
          <div className={navLinkClass}>Home</div>

          {/* Dropdowns */}
          {[
            { label: "About us", items: ["Our Story", "Team", "Careers"] },
            { label: "For Founders", items: ["Raise Capital", "Launch Campaign"] },
            { label: "For Investors", items: ["Browse Projects", "Investor Dashboard"] },
          ].map(({ label, items }) => (
            <div
              key={label}
              className="relative"
              onMouseEnter={() => handleDropdown(label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div className={`${navLinkClass} flex items-center gap-1`}>
                {label}
                <ChevronDown size={14} />
              </div>

              {openDropdown === label && (
                <div className="absolute top-full mt-3 w-48 rounded-md bg-white dark:bg-[#1c1c24] shadow-xl py-2 z-40 animate-fade-in">
                  {items.map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[#2c2c34] transition-colors"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <a href="#" className={navLinkClass}>
            Features
          </a>
          <a href="#" className={navLinkClass}>
            FAQs
          </a>
        </nav>

        {/* Theme Toggle and Wallet Button */}
        <div className="flex items-center gap-4">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-black dark:text-white  dark:bg-black/30 hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          <div ref={walletButtonRef} className="relative">
            {/* Only render the wallet content after mounting to prevent hydration mismatch */}
            {mounted ? (
              <ConnectButton />
            ) : (
              // Show a skeleton button during server-side rendering and initial client render
              <button 
                className="px-4 py-2 text-sm text-white rounded-full bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] opacity-90 flex items-center gap-2 cursor-pointer"
              >
                <Wallet size={16} />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
