"use client"

import type { ProjectFormData } from "../AddProjectForm"

interface TeamProps {
  formData: ProjectFormData
  updateFormData: (data: Partial<ProjectFormData>) => void
}

const Team: React.FC<TeamProps> = ({ formData, updateFormData }) => {
  // This is a placeholder component for the Team step
  return (
    <div className="space-y-6">
      <p className="text-center text-gray-500">Team information will be collected in this step.</p>
    </div>
  )
}

export default Team
