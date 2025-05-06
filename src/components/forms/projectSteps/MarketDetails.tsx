"use client"

import type { ProjectFormData } from "../AddProjectForm"

interface MarketDetailsProps {
  formData: ProjectFormData
  updateFormData: (data: Partial<ProjectFormData>) => void
}

const MarketDetails: React.FC<MarketDetailsProps> = ({ formData, updateFormData }) => {
  // This is a placeholder component for the Market Details step
  return (
    <div className="space-y-6">
      <p className="text-center text-gray-500">Market Details information will be collected in this step.</p>
    </div>
  )
}

export default MarketDetails
