"use client"

import type React from "react"
import { Sun, Clock8, Bell, Settings } from "lucide-react"
import SearchBar from "./SearchBar"

interface TopNavigationProps {
  walletAddress: string | undefined
  onSwitchView: () => void
}

const TopNavigation: React.FC<TopNavigationProps> = ({ walletAddress, onSwitchView }) => {
  // Format address for display
  const formatAddress = (address: string | undefined) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <>
      {/* Connected Wallet Address */}
      <div className="flex justify-end px-6 py-2 bg-white border-b border-gray-100">
        <div className="text-sm text-gray-600">
          Connected: <span className="font-medium text-gray-900">{formatAddress(walletAddress)}</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
        {/* Search Bar */}
        <SearchBar placeholder="Search" />

        {/* Center Controls */}
        <div className="flex items-center space-x-6">
          <button className="text-gray-500 hover:text-gray-700">
            <Sun className="h-5 w-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <Clock8 className="h-5 w-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-700 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onSwitchView} 
            className="px-4 py-2 rounded-full text-white font-medium transition-all"
            style={{ background: 'linear-gradient(90deg, #FF7171 0%, #2F50FF 100%)' }}
          >
            Switch to Investors
          </button>
          <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white">
            <span className="text-sm font-medium">{walletAddress && walletAddress[0].toUpperCase()}</span>
          </div>
          <button className="ml-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="4" fill="#F1F1F1" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}

export default TopNavigation 