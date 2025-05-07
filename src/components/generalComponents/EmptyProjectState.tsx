"use client"

import type React from "react"
import Image from "next/image"

interface EmptyProjectStateProps {
  walletAddress: string | undefined
  onAddProject: () => void
}

const EmptyProjectState: React.FC<EmptyProjectStateProps> = ({ walletAddress, onAddProject }) => {
  // Format address for display
  const formatAddress = (address: string | undefined) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="border border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-black/30 backdrop-blur-sm shadow-lg shadow-black/10">
      <div className="mb-6">
        <Image src="/checklist-illustration.png" alt="No projects found" width={150} height={150} className="mx-auto opacity-80" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">
        We're unable to locate any projects associated with your wallet address:
      </h3>
      <p className="text-[#FF7171] font-medium mb-4">{formatAddress(walletAddress)}</p>
      <p className="text-gray-400 mb-6 max-w-md">
        To find your project, please use the search function above. If your project isn't listed, feel free to create a
        new one
      </p>
      <button
        onClick={onAddProject}
        className="px-4 py-2 rounded-full text-white font-medium transition-all"
        style={{ background: 'linear-gradient(90deg, #FF7171 0%, #2F50FF 100%)' }}
      >
        Add project
      </button>
    </div>
  )
}

export default EmptyProjectState