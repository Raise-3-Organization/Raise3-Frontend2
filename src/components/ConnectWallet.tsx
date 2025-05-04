import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useConnect, useAccount } from "wagmi";
import { useRouter } from "next/navigation";

const ConnectWallet: React.FC = () => {
  const router = useRouter();
  const { connect, connectors, isPending, error } = useConnect();
  const { isConnected } = useAccount();
  const [selectedNetwork, setSelectedNetwork] = useState("Ethereum");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'error' | 'info' | 'success'} | null>(null);

  // Network options
  const networks = ["Ethereum", "Polygon", "Solana", "Ton"];
  
  // Wallet options with their details - properly map to available connectors
  const wallets = [
    {
      name: "Metamask wallet",
      description: "Desktop/DApp in app",
      icon: "https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg",
      connector: connectors.find(c => c.id === 'injected') || connectors.find(c => c.name.toLowerCase().includes('metamask')),
    },
    {
      name: "Coinbase wallet",
      description: "Desktop/DApp in app",
      icon: "https://raw.githubusercontent.com/coinbase/coinbase-wallet-sdk/master/assets/coinbase-logo.png",
      connector: connectors.find(c => c.id === 'coinbaseWallet') || connectors.find(c => c.name.toLowerCase().includes('coinbase')),
    },
    {
      name: "Wallet Connect",
      description: "Any wallet and Browser",
      icon: "https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Icon/Blue%20(Default)/Icon.svg",
      connector: connectors.find(c => c.id === 'walletConnect') || connectors.find(c => c.name.toLowerCase().includes('walletconnect')),
    },
  ];

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle wallet connection
  const handleConnect = (connector: any) => {
    if (!acceptedTerms) {
      setToast({
        message: "Please accept the terms and conditions before connecting",
        type: "error"
      });
      return;
    }
    
    if (connector) {
      setToast({
        message: "Connecting to wallet...",
        type: "info"
      });
      connect({ connector });
    }
  };

  // Redirect to registration if connected
  React.useEffect(() => {
    if (isConnected) {
      // Redirect to registration page as per the flow
      router.push("/register");
    }
  }, [isConnected, router]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-6 py-10 relative">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 p-4 rounded-md shadow-lg z-50 transition-opacity duration-300 
          ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}>
          <p className="text-white font-medium">{toast.message}</p>
        </div>
      )}

      {/* Main scrollable container with proper padding for terms section */}
      <div className="flex flex-col w-full items-center pb-48">
        {/* Main Content */}
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="mb-6">
            <Image
              src="/image.png"
              alt="Raise3 Logo"
              width={120}
              height={60}
              priority
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
            Connect <span className="text-gradient">wallet</span>
          </h1>
          <p className="text-gray-400 text-center mb-6">
            Choose how you want to connect.
          </p>

          {/* Choose Network */}
          <div className="flex gap-2 bg-[#111] px-3 py-2 rounded-full mb-6 overflow-x-auto w-full justify-center">
            {networks.map((network, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedNetwork(network)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  network === selectedNetwork ? "bg-gradient-to-r from-purple-500 to-indigo-500" : "bg-transparent text-gray-400"
                }`}
              >
                {network}
              </button>
            ))}
          </div>

          {/* Popular Wallets */}
          <div className="w-full space-y-3 mb-8">
            {wallets.map((wallet, idx) => (
              <div
                key={idx}
                onClick={() => wallet.connector && handleConnect(wallet.connector)}
                className={`flex items-center justify-between bg-[#111] px-4 py-3 rounded-xl hover:bg-[#1a1a1a] transition cursor-pointer ${!wallet.connector ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 relative flex items-center justify-center bg-gray-800 rounded-full">
                    <Image 
                      src={wallet.icon} 
                      alt={wallet.name} 
                      width={20} 
                      height={20}
                      onError={(e) => {
                        // Fallback for broken images
                        const target = e.target as HTMLImageElement;
                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='4' width='20' height='16' rx='2'/%3E%3Cpath d='M12 8v8'/%3E%3Cpath d='M8 12h8'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{wallet.name}</h3>
                    <p className="text-xs text-gray-500">{wallet.description}</p>
                  </div>
                </div>
                <div className="text-gray-400">{">"}</div>
              </div>
            ))}
          </div>

          {/* Connection Status */}
          {isPending && <p className="text-blue-400 text-sm">Connecting...</p>}
          {error && <p className="text-red-400 text-sm mb-4">{error.message}</p>}
        </div>
      </div>

      {/* Terms and Support - fixed at the bottom, always visible but not covering content */}
      <div className="fixed bottom-0 left-0 w-full bg-black pt-4">
        <div className="text-center text-sm space-y-2 w-full max-w-md mx-auto bg-[#111] p-4 rounded-lg border border-gray-800 shadow-lg">
          <p className="text-gray-400">
            You got Questions?{" "}
            <span className="text-white font-semibold underline cursor-pointer">
              Contact for Support
            </span>
          </p>
          <p className="text-gray-500">
            Accept{" "}
            <span className="underline cursor-pointer text-white">Terms of Service</span> and{" "}
            <span className="underline cursor-pointer text-white">Privacy Policy</span>
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <input 
              type="checkbox" 
              className="accent-purple-600 w-5 h-5 cursor-pointer" 
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              id="terms-checkbox"
            />
            <label htmlFor="terms-checkbox" className="cursor-pointer">I read and accept</label>
          </div>
        </div>
      </div>

      {/* Bottom gradient for visual effect only - positioned behind the terms section */}
      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-purple-900 via-purple-600 to-transparent opacity-30 pointer-events-none z-0" />
    </div>
  );
};

export default ConnectWallet; 