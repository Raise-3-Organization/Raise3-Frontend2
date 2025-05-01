"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Redirect to connect wallet if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/connect-wallet");
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
    <div className="flex flex-col items-center justify-between bg-black text-white px-6 min-h-screen overflow-y-auto py-10">
      {/* Connected Account */}
      {isConnected && address && (
        <div className="fixed top-4 right-4 bg-[#111] px-4 py-2 rounded-full text-sm z-10">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      )}

      <div className="flex flex-col items-center w-full max-w-2xl mx-auto mb-16">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/image.png"
            alt="Raise3 Logo"
            width={120}
            height={60}
            priority
          />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
          Choose your <span className="text-gradient">role</span>
        </h1>
        <p className="text-gray-400 text-center mb-10 max-w-md">
          Select how you want to participate in the Raise3 ecosystem.
        </p>

        {/* Role Selection */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              role: "Founder",
              description: "Raise funds for your project through milestones",
              icon: "🚀",
            },
            {
              role: "Investor",
              description: "Invest in promising projects with milestone protection",
              icon: "💰",
            },
            {
              role: "Both",
              description: "Full access to both founder and investor features",
              icon: "🌟",
            },
          ].map((option) => (
            <div
              key={option.role}
              onClick={() => handleRoleSelect(option.role)}
              className={`p-6 rounded-xl flex flex-col items-center text-center cursor-pointer transition hover:transform hover:scale-105 ${
                selectedRole === option.role
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                  : "bg-[#111] hover:bg-[#1a1a1a]"
              }`}
            >
              <div className="text-4xl mb-4">{option.icon}</div>
              <h3 className="font-bold text-xl mb-2">{option.role}</h3>
              <p className="text-sm text-gray-400">{option.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button - moved to its own container at the bottom */}
      <div className="w-full max-w-md z-10 relative mb-6">
        <button
          onClick={handleContinue}
          className={`w-full py-3 rounded-full font-semibold text-center transition ${
            selectedRole
              ? "bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90"
              : "bg-gray-700 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>

      {/* Gradient at bottom */}
      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-purple-900 via-purple-600 to-transparent opacity-30 pointer-events-none" />
    </div>
  );
} 