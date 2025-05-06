"use client"

import { useState } from "react"
import type { ProjectFormData } from "../AddProjectForm"

interface GeneralInfoStepProps {
  formData: ProjectFormData
  updateFormData: (data: Partial<ProjectFormData>) => void
}

const GeneralInfoStep: React.FC<GeneralInfoStepProps> = ({ formData, updateFormData }) => {
  // Track validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validate the form before submitting
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.projectName.trim()) {
      newErrors.projectName = "Project name is required"
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    
    if (!formData.projectProblem.trim()) {
      newErrors.projectProblem = "Project problem is required"
    }
    
    if (!formData.projectSolution.trim()) {
      newErrors.projectSolution = "Project solution is required"
    }
    
    if (!formData.projectMission.trim()) {
      newErrors.projectMission = "Project mission is required"
    }
    
    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
          Project name*
        </label>
        <input
          type="text"
          id="projectName"
          name="projectName"
          value={formData.projectName}
          onChange={handleChange}
          placeholder="Enter your project Name"
          className={`w-full px-4 py-2 border ${
            errors.projectName ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.projectName && (
          <p className="mt-1 text-sm text-red-500">{errors.projectName}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description*
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-2 border ${
            errors.description ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
        <span className="absolute bottom-2 right-2 text-gray-400 text-xs">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </span>
      </div>

      <div>
        <label htmlFor="projectProblem" className="block text-sm font-medium text-gray-700 mb-1">
          Project Problem*
        </label>
        <textarea
          id="projectProblem"
          name="projectProblem"
          value={formData.projectProblem}
          onChange={handleChange}
          placeholder="E.g: Lack of Interactive Features: Users are seeking more engaging content and activities."
          rows={3}
          className={`w-full px-4 py-2 border ${
            errors.projectProblem ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
        />
        {errors.projectProblem && (
          <p className="mt-1 text-sm text-red-500">{errors.projectProblem}</p>
        )}
        <span className="absolute bottom-2 right-2 text-gray-400 text-xs">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </span>
      </div>

      <div>
        <label htmlFor="projectSolution" className="block text-sm font-medium text-gray-700 mb-1">
          Project Solution*
        </label>
        <textarea
          id="projectSolution"
          name="projectSolution"
          value={formData.projectSolution}
          onChange={handleChange}
          rows={3}
          className={`w-full px-4 py-2 border ${
            errors.projectSolution ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
        />
        {errors.projectSolution && (
          <p className="mt-1 text-sm text-red-500">{errors.projectSolution}</p>
        )}
        <span className="absolute bottom-2 right-2 text-gray-400 text-xs">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </span>
      </div>

      <div>
        <label htmlFor="projectMission" className="block text-sm font-medium text-gray-700 mb-1">
          Project Mission*
        </label>
        <textarea
          id="projectMission"
          name="projectMission"
          value={formData.projectMission}
          onChange={handleChange}
          rows={3}
          className={`w-full px-4 py-2 border ${
            errors.projectMission ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
        />
        {errors.projectMission && (
          <p className="mt-1 text-sm text-red-500">{errors.projectMission}</p>
        )}
        <span className="absolute bottom-2 right-2 text-gray-400 text-xs">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </span>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location*
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className={`w-full px-4 py-2 border ${
            errors.location ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-500">{errors.location}</p>
        )}
      </div>
    </div>
  )
}

export default GeneralInfoStep
