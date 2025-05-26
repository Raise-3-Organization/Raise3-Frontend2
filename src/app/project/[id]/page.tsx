'use client'
import React, { useState } from 'react'
import ProjectView from '@/components/project/ProjectView'
import CreateMilestone from '@/components/milestone/CreateMilestone'
import FundCampaignModal from '@/components/project/FundCampaignModal'
import { useParams } from 'next/navigation'
import NavbarDashboard from '@/components/NavbarDashboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faCheckCircle, faCoins } from '@fortawesome/free-solid-svg-icons'
import { useProjectDetails } from '@/hooks/useProjectDetails'
import { useReadProjects } from '@/hooks/useReadProjects'
import Raise3Abi from "@/abis/Raise3MileStone.json";
import { contractAddress } from '@/contants';
import { useWriteContract, useAccount } from 'wagmi';
import { useRoles } from '@/hooks/useRoles'
import CompleteProjectButton from '@/components/project/CompleteProjectButton'


const PreviewProject = () => {
    const [isMilestoneOpen, setIsMilestoneOpen] = useState(false);
    const [isFundModalOpen, setIsFundModalOpen] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [error, setError] = useState<string | null>(null); // Add error state

    const params = useParams();
    const { address } = useAccount();

    const { isManagerRole } = useRoles(address as `0x${string}`);
    const { writeContractAsync } = useWriteContract()


    const { projects } = useReadProjects(params?.id as string);
    const { projectDetails, project } = useProjectDetails(projects as any[]);
    // Project name would come from your data in a real implementation

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



    const handleCompleteProject = async () => {
        try {
            setIsCompleted(true);

            if (isManagerRole) {
                await writeContractAsync({
                    abi: Raise3Abi,
                    address: contractAddress,
                    functionName: 'completeProject',
                    args: [params?.id as string]
                });
            }


        } catch (error) {
            console.error("Error completing project:", error);
            setIsCompleted(false);
            setError("Failed to complete the project. Please try again."); // Set error message

        }
    };

    // Review, 0
    // Active, 1
    // Completed, 2
    //Flaged, 3
    console.log(project?.CampaignStatus, "status")

    return (
        <>
            <NavbarDashboard />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="mb-6 flex flex-wrap justify-between items-center gap-3">
                    <h1 className="text-2xl font-bold text-white">{projectDetails?.projectName}</h1>

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
                        <CompleteProjectButton
                            campaignStatus={project?.CampaignStatus || 0}
                            
                            onComplete={handleCompleteProject}
                        />
                        {/* <button
                            onClick={handleCompleteProject}
                            className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 flex items-center ${isCompleted ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500'}`}
                            disabled={isCompleted}
                        >
                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2 h-4 w-4" />
                            {isCompleted ? 'Completed!' : 'Mark as Complete'}
                        </button> */}
                    </div>
                </div>
                {error && (
                    <div className="mt-4 p-4 bg-red-900/30 border border-red-800/50 text-red-400 rounded-lg">
                        {error}
                    </div>
                )}

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
                    projectName={projectDetails?.projectName || "Raise3"}
                    projectId={params?.id as string}
                />
            )}
        </>
    )
}

export default PreviewProject