import Image from "next/image";
import React from "react";

const ConnectWallet: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 relative">
      {/* Gradient at bottom */}
      <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-purple-900 via-purple-600 to-transparent" />

      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/image.png" // Replace with your logo path
          alt="Raise3 Logo"
          width={120}
          height={60}
        />
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
        Connect <span className="text-gradient">wallet</span>
      </h1>
      <p className="text-gray-400 text-center mb-10">
        Choose how you want to connect.
      </p>

      {/* Choose Network */}
      <div className="flex gap-4 bg-[#111] px-4 py-2 rounded-full mb-12">
        {["Ethereum", "Polygon", "Solana", "Ton"].map((network, idx) => (
          <button
            key={idx}
            className={`px-5 py-2 rounded-full text-sm font-semibold ${
              idx === 0 ? "bg-gradient-to-r from-purple-500 to-indigo-500" : "bg-transparent text-gray-400"
            }`}
          >
            {network}
          </button>
        ))}
      </div>

      {/* Popular Wallets */}
      <div className="w-full max-w-md space-y-4">
        {[
          {
            name: "Metamask wallet",
            description: "Desktop/DApp in app",
            icon: "/metamask.png", // Replace with real path
          },
          {
            name: "Coinbase wallet",
            description: "Desktop/DApp in app",
            icon: "/coinbase.png",
          },
          {
            name: "Wallet Connect",
            description: "Any wallet and Browser",
            icon: "/walletconnect.png",
          },
        ].map((wallet, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-[#111] px-5 py-4 rounded-xl hover:bg-[#1a1a1a] transition cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <Image src={wallet.icon} alt={wallet.name} width={32} height={32} />
              <div>
                <h3 className="font-semibold">{wallet.name}</h3>
                <p className="text-xs text-gray-500">{wallet.description}</p>
              </div>
            </div>
            <div className="text-gray-400">{">"}</div>
          </div>
        ))}
      </div>

      {/* Terms and Support */}
      <div className="text-center mt-12 text-sm space-y-2">
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
          <input type="checkbox" className="accent-purple-600" />
          <label>I read and accept</label>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
