"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAccount } from "wagmi";
import Footer from "@/components/landingPage/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Initialize variables outside the try-catch block
  const accountData = useAccount();
  const isConnected = accountData.isConnected;
  const address = accountData.address;

  // Update wallet address when connected
  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
    }
  }, [isConnected, address]);

  // Redirect to connect wallet if not connected
  useEffect(() => {
    if (!isConnected) {
      // Uncomment this when you have the connect-wallet page ready
      // router.push("/connect-wallet");
    }
  }, [isConnected, router]);

  // Handle role selection
  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  // Continue to dashboard
  const handleContinue = () => {
    if (!selectedRole) {
      alert("Please select a role to continue");
      return;
    }

    // Store role information
    localStorage.setItem("user-role", selectedRole);
    
    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div 
      className="flex flex-col items-center justify-between min-h-screen overflow-y-auto relative"
      style={{
        backgroundImage: 'url("https://res.cloudinary.com/detc4yjdi/image/upload/v1/Desktop_-_4_p2cjn5.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {/* Connected Account */}
      {walletAddress && (
        <div className="fixed top-4 right-4 bg-[#111]/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm z-10 text-white border border-gray-800">
          Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </div>
      )}

      {/* Header with Logo */}
      <header className="w-full flex justify-between items-center p-4 relative z-10">
        <div className="ml-4">
          <Image src="/raise3-logo.svg" alt="Raise3 Logo" width={120} height={60} priority />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-grow w-full max-w-5xl mx-auto px-4 relative z-10 text-white">
        {/* Welcome Text */}
        <div className="text-center mb-12">
          <h2 className="text-xl mb-1">
            Welcome to <span className="font-bold">Raise3</span>
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold">How would you like to continue?</h1>
        </div>

        {/* Role Selection Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-4xl">
          {/* Investors Card */}
          <div
            onClick={() => handleRoleSelect("Investor")}
            className={`relative overflow-hidden rounded-xl p-6 flex flex-col items-center cursor-pointer transition-all duration-300 backdrop-blur-sm
              ${selectedRole === "Investor" 
                ? "ring-2 ring-[#FF7171] bg-[#FF7171]/10" 
                : "bg-[#111]/80 hover:bg-[#1a1a1a]/80 border border-gray-800 hover:border-[#FF7171]"
              } hover:transform hover:scale-105`}
          >
            <div className="mb-6 h-40 w-40 relative">
              <Image 
                src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745454301/research_of_statistical_data_and_analytics_hgxisk.png"
                alt="Investors Icon" 
                width={160} 
                height={160} 
              />
            </div>
            <h3 className="font-bold text-2xl mb-2">Investor</h3>
            <p className="text-sm text-gray-400 text-center">
              Investors who want early access to real projects with real terms
            </p>
            {selectedRole === "Investor" && (
              <div className="absolute top-3 right-3 h-6 w-6 bg-[#FF7171] rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>

          {/* Founders Card */}
          <div
            onClick={() => handleRoleSelect("Founder")}
            className={`relative overflow-hidden rounded-xl p-6 flex flex-col items-center cursor-pointer transition-all duration-300 backdrop-blur-sm
              ${selectedRole === "Founder" 
                ? "ring-2 ring-[#FF7171] bg-[#FF7171]/10" 
                : "bg-[#111]/80 hover:bg-[#1a1a1a]/80 border border-gray-800 hover:border-[#FF7171]"
              } hover:transform hover:scale-105`}
          >
            <div className="mb-6 h-40 w-40 relative">
              <Image 
                src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745454661/rocket_with_up_arrow_1_qh5rc8.png"
                alt="Founders Icon" 
                width={160} 
                height={160} 
              />
            </div>
            <h3 className="font-bold text-2xl mb-2">Founder</h3>
            <p className="text-sm text-gray-400 text-center">
              Teams who care about transparency, speed, and doing things on-chain
            </p>
            {selectedRole === "Founder" && (
              <div className="absolute top-3 right-3 h-6 w-6 bg-[#FF7171] rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className={`py-3 px-12 rounded-full font-semibold text-center transition-all duration-300 text-white
            ${selectedRole
              ? "bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] hover:opacity-90 hover:scale-105"
              : "bg-gray-700/50 backdrop-blur-sm cursor-not-allowed"
            }`}
        >
          Continue
        </button>
      </main>

      {/* Footer */}
      <div className="w-full relative z-10">
        <Footer />
      </div>
    </div>
  );
} 