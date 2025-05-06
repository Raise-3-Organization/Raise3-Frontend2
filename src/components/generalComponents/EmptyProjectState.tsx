"use client"

import { useState } from "react"
import type React from "react"
import Image from "next/image"
import AddProjectForm from "../forms/AddProjectForm"
import type { ProjectFormData } from "../forms/AddProjectForm"

interface EmptyProjectStateProps {
  walletAddress: string | undefined
  onAddProject?: () => void
}

const EmptyProjectState: React.FC<EmptyProjectStateProps> = ({ walletAddress, onAddProject }) => {
  // State to control project form visibility
  const [showProjectForm, setShowProjectForm] = useState(false)
  
  // Format address for display
  const formatAddress = (address: string | undefined) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Handle opening the form
  const handleOpenForm = () => {
    setShowProjectForm(true)
    if (onAddProject) onAddProject()
  }

  // Handle form submission
  const handleSubmitProject = (data: ProjectFormData) => {
    // Here you would handle the project creation with the API
    console.log("Project submitted:", data)
    setShowProjectForm(false)
  }

  return (
    <>
      <div className="border border-dashed border-blue-300 rounded-lg p-8 flex flex-col items-center justify-center text-center">
        <div className="mb-6">
          <Image src="/checklist-illustration.png" alt="No projects found" width={150} height={150} className="mx-auto" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          We're unable to locate any projects associated with your wallet address:
        </h3>
        <p className="text-blue-600 font-medium mb-4">{formatAddress(walletAddress)}</p>
        <p className="text-gray-500 mb-6 max-w-md">
          To find your project, please use the search function above. If your project isn't listed, feel free to create a
          new one
        </p>
        <button
          onClick={handleOpenForm}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Add project
        </button>
      </div>

      {/* Project Form Modal */}
      {showProjectForm && (
        <AddProjectForm 
          onClose={() => setShowProjectForm(false)} 
          onSubmit={handleSubmitProject} 
        />
      )}
    </>
  )
}

export default EmptyProjectState