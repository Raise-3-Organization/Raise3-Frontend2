'use client'
import React, { useState } from 'react'
import ProjectView from '@/components/project/ProjectView'
import CreateMilestone from '@/components/milestone/CreateMilestone'
import FundCampaignModal from '@/components/project/FundCampaignModal'
import { useParams } from 'next/navigation'
import NavbarDashboard from '@/components/NavbarDashboard'
import ProjectMilestone from '@/components/milestone/ProjectMilestone'
import { useReadMileStone } from '@/hooks/useReadMileStone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faCheckCircle, faCoins } from '@fortawesome/free-solid-svg-icons'
const PreviewProject = () => {
    const [isMilestoneOpen, setIsMilestoneOpen] = useState(false);
    const [isFundModalOpen, setIsFundModalOpen] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const params = useParams();
    
    // Project name would come from your data in a real implementation
    const projectName = "Raise3 DeFi Project";
    
    const handleOpenMilestone = () => {
        setIsMilestoneOpen(true);
    };

    const handleCloseMilestone = () => {
        setIsMilestoneOpen(false);
    };
    
    const handleOpenFundModal = () => {
        setIsFundModalOpen(true);
    };
    
    const handleCloseFundModal = () => {
        setIsFundModalOpen(false);
    };
    
    const handleFundSubmit = (data: { amount: string; currency: string }) => {
        console.log('Funding data:', data);
        // In a real app, you would send this to your API
    };
    
    const handleCompleteProject = () => {
        // In a real app, you would send a request to your API to mark the project as completed
        setIsCompleted(true);
        
        // After 3 seconds, reset the state for demo purposes
        setTimeout(() => {
            setIsCompleted(false);
        }, 3000);
    };

    return (
        <>
            <NavbarDashboard />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="mb-6 flex flex-wrap justify-between items-center gap-3">
                    <h1 className="text-2xl font-bold text-white">{projectName}</h1>
                    
                    <div className="flex flex-wrap gap-3">
                        {/* Fund Project Button */}
                        <button 
                            onClick={handleOpenFundModal}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 rounded-lg text-white font-medium transition-all duration-300 flex items-center"
                        >
                            <FontAwesomeIcon icon={faCoins} className="mr-2 h-4 w-4" />
                            Fund Project
                        </button>
                        
                        {/* Add Milestone Button */}
                        <button 
                            onClick={handleOpenMilestone}
                            className="px-4 py-2 bg-gradient-to-r from-[#FF7171] to-[#FF5C87] hover:from-[#FF5C87] hover:to-[#FF7171] rounded-lg text-white font-medium transition-all duration-300 flex items-center"
                        >
                            <FontAwesomeIcon icon={faPencilAlt} className="mr-2 h-4 w-4" />
                            Add Milestone
                        </button>
                        
                        {/* Complete Project Button */}
                        <button 
                            onClick={handleCompleteProject}
                            className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 flex items-center ${isCompleted ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500'}`}
                            disabled={isCompleted}
                        >
                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2 h-4 w-4" />
                            {isCompleted ? 'Completed!' : 'Mark as Complete'}
                        </button>
                    </div>
                </div>
                
                <ProjectView />
            </div>
            
            {isMilestoneOpen && (
                <CreateMilestone 
                    onClose={handleCloseMilestone} 
                    projectId={params?.id as string} 
                />
            )}
            
            {isFundModalOpen && (
                <FundCampaignModal
                    onClose={handleCloseFundModal}
                    onSubmit={handleFundSubmit}
                    projectName={projectName}
                    projectId={params?.id as string}
                />
            )}
        </>
    )
}

export default PreviewProject