"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

// Use dynamic imports for each form step
const GeneralInfoStep = dynamic(() => import("./projectSteps/GeneralInfoStep"), { ssr: false })
const MarketDetails = dynamic(() => import("./projectSteps/MarketDetails"), { ssr: false })
const ProjectStage = dynamic(() => import("./projectSteps/ProjectStage"), { ssr: false })
const ContactInfo = dynamic(() => import("./projectSteps/ContactInfo"), { ssr: false })
const Team = dynamic(() => import("./projectSteps/Team"), { ssr: false })

export type FormStepType = "general-info" | "market-details" | "project-stage" | "contact-info" | "team"

export interface ProjectFormData {
  projectName: string
  description: string
  projectProblem: string
  projectSolution: string
  projectMission: string
  location: string
  // Will add more fields for other steps later
}

interface AddProjectFormProps {
  onClose: () => void
  onSubmit: (data: ProjectFormData) => void
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState<FormStepType>("general-info")
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: "",
    description: "",
    projectProblem: "",
    projectSolution: "",
    projectMission: "",
    location: "",
  })

  const updateFormData = (partialData: Partial<ProjectFormData>) => {
    setFormData({ ...formData, ...partialData })
  }

  const handleNext = () => {
    switch (currentStep) {
      case "general-info":
        setCurrentStep("market-details")
        break
      case "market-details":
        setCurrentStep("project-stage")
        break
      case "project-stage":
        setCurrentStep("contact-info")
        break
      case "contact-info":
        setCurrentStep("team")
        break
      case "team":
        onSubmit(formData)
        break
    }
  }

  const stepTitles: Record<FormStepType, string> = {
    "general-info": "General Info",
    "market-details": "Market Details",
    "project-stage": "Project Stage",
    "contact-info": "Contact Info",
    "team": "Team",
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Create a new project!</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            Fill out the form below. Your Project Page will be created once you complete all the sections.
          </p>
          
          {/* Step indicator */}
          <div className="flex justify-between mb-8">
            {Object.entries(stepTitles).map(([step, title]) => (
              <div 
                key={step} 
                className={`flex flex-col items-center ${currentStep === step ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                  ${currentStep === step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                >
                  {/* Could add step number or icon here */}
                </div>
                <span className="text-sm">{title}</span>
              </div>
            ))}
          </div>

          {/* Current step content */}
          {currentStep === "general-info" && (
            <GeneralInfoStep formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === "market-details" && (
            <MarketDetails formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === "project-stage" && (
            <ProjectStage formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === "contact-info" && (
            <ContactInfo formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === "team" && (
            <Team formData={formData} updateFormData={updateFormData} />
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800"
            >
              {currentStep === "team" ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProjectForm
