"use client"

import type { ProjectFormData } from "../AddProjectForm"

interface ContactInfoProps {
  formData: ProjectFormData
  updateFormData: (data: Partial<ProjectFormData>) => void
}

const ContactInfo: React.FC<ContactInfoProps> = ({ formData, updateFormData }) => {
  // This is a placeholder component for the Contact Info step
  return (
    <div className="space-y-6">
      <p className="text-center text-gray-500">Contact information will be collected in this step.</p>
    </div>
  )
}

export default ContactInfo
