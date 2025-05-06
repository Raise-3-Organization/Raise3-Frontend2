"use client"

import type { ProjectFormData } from "../AddProjectForm"

interface ProjectStageProps {
  formData: ProjectFormData
  updateFormData: (data: Partial<ProjectFormData>) => void
}

const ProjectStage: React.FC<ProjectStageProps> = ({ formData, updateFormData }) => {
  // This is a placeholder component for the Project Stage step
  return (
    <div className="space-y-6">
      <p className="text-center text-gray-500">Project Stage information will be collected in this step.</p>
    </div>
  )
}

export default ProjectStage
