"use client"

import type React from "react"
import { Sun, Clock8, Bell, Settings } from "lucide-react"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import SearchBar from "./SearchBar"

interface TopNavigationProps {
  walletAddress: string | undefined
  onSwitchView: () => void
}

const TopNavigation: React.FC<TopNavigationProps> = ({ walletAddress, onSwitchView }) => {

  return (
    <>
      {/* Connected Wallet Address with RainbowKit */}
      <div className="flex justify-end items-center px-6 py-2 bg-[#111] border-b border-gray-800">
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            const connected = mounted && account && chain

            return (
              <div
                {...(!mounted && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button 
                        onClick={openConnectModal}
                        type="button"
                        className="px-4 py-1.5 rounded-full text-white text-sm font-medium bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB]"
                      >
                        Connect Wallet
                      </button>
                    )
                  }

                  return (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={openChainModal}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-white rounded-full text-sm bg-gradient-to-r from-[#2F50FF] to-[#6B46C1] hover:opacity-90"
                      >
                        {chain.name}
                      </button>

                      <button
                        onClick={openAccountModal}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-white rounded-full text-sm bg-gradient-to-r from-[#FF7171] to-[#9360BB] hover:opacity-90"
                      >
                        {account.displayName}
                      </button>
                    </div>
                  )
                })()}
              </div>
            )
          }}
        </ConnectButton.Custom>
      </div>

      {/* Main Navigation */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-[#0B0B0F]">
        {/* Search Bar */}
        <SearchBar placeholder="Search" />

        {/* Center Controls */}
        <div className="flex items-center space-x-6">
          <button className="text-gray-400 hover:text-white">
            <Sun className="h-5 w-5" />
          </button>
          <button className="text-gray-400 hover:text-white">
            <Clock8 className="h-5 w-5" />
          </button>
          <button className="text-gray-400 hover:text-white relative">
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