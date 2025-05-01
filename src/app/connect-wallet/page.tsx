"use client";
import ConnectWallet from "@/components/ConnectWallet";
import { useRouter } from "next/navigation";

export default function ConnectWalletPage() {
  const router = useRouter();
  
  return (
    <div className="relative">
      <ConnectWallet />
      <button 
        onClick={() => router.back()}
        className="absolute top-4 right-4 text-white text-xl font-bold bg-purple-800 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer z-50"
      >
        ×
      </button>
    </div>
  );
} 