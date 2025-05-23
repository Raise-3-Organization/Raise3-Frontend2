'use client'
import React from 'react'
import { useProjectDetails } from '@/hooks/useProjectDetails'
import { Search, Filter, ChevronDown, Flag, Eye, CheckCircle } from "lucide-react";
import { useAccount, useWriteContract } from 'wagmi';
import { useReadProjects } from '@/hooks/useReadProjects';
import { toast } from '@/components/ui/use-toast';
import { contractAddress } from "@/contants"
import Raise3Abi from "@/abis/Raise3MileStone.json";
import SkeletonLoader from '@/components/dashboard/SkeletonLoader';
import { useRoles } from '@/hooks/useRoles';
interface ProjectId {
    id: string;
  }
const AdminProject = ({ id }: ProjectId) => {
    const { projects, isProjectLoading } = useReadProjects(id)
    const { project, projectDetails } = useProjectDetails(projects as any[]);
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract()
    const { isManagerRole } = useRoles(address as `0x${string}`)
       
    const handleFlagProject = async ({ id }: ProjectId) => {

        if(!isManagerRole) {
            toast({
                title: "Error",
                description: "Manager Role needed",
                variant: "destructive",
            })
        }
        try {
            await writeContractAsync({
                abi: Raise3Abi,
                address: contractAddress,
                functionName: "flagCampaign",
                args: [id]
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to flag project",
                variant: "destructive",
            })
        }
    }
    const handleApprove = async ({ id }: ProjectId) => {
        if(!isManagerRole) {
            toast({
                title: "Error",
                description: "Manager Role needed",
                variant: "destructive",
            })
        }
        try {
            await writeContractAsync({
                abi: Raise3Abi,
                address: contractAddress,
                functionName: "flagCampaign",
                args: [id]
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to flag project",
                variant: "destructive",
            })
        }
    }

    if (isProjectLoading) {
        return <SkeletonLoader />
      }
    
    return (
        <>
            <tbody>

                <tr className="border-b border-gray-800">
                    <td className="py-4 px-4">
                        <div>
                            <div className="font-medium">{projectDetails?.projectName}</div>
                            <div className="text-sm text-gray-400 truncate max-w-[200px]">{projectDetails?.description}</div>
                        </div>
                    </td>
                    <td className="py-4 px-4">
                        <div className="font-medium">{projectDetails?.name}</div>
                        <div className="text-sm text-gray-400">{project?.founder?.slice(0, 6)}...{project?.founder?.slice(-4)}</div>
                    </td>
                    <td className="py-4 px-4">{projectDetails?.projectType}</td>
                    <td className="py-4 px-4">{projectDetails?.network}</td>
                    <td className="py-4 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${project?.CampaignStatus === 1
                                ? 'bg-green-900/30 text-green-500'
                                : project?.CampaignStatus === 0
                                    ? 'bg-yellow-900/30 text-yellow-500'
                                    : 'bg-red-900/30 text-red-500'
                            }`}>
                            {project?.CampaignStatus === 0 ? 'Under Review' : project?.CampaignStatus === 1 ? 'Active' : project?.CampaignStatus === 2 ? 'Completed' : 'Flagged'}
                        </span>
                    </td>
                    <td className="py-4 px-4">
                        <div className="font-medium">${project?.totalRaised.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">of ${project?.goalAmount.toLocaleString()}</div>
                        <div className="mt-1 w-full bg-gray-800 rounded-full h-1.5">
                            <div
                                className="bg-gradient-to-r from-[#2F50FF] to-[#FF7171] h-1.5 rounded-full"
                                style={{ width: `${((project?.totalRaised ?? 0) / (project?.goalAmount ?? 1)) * 100}%` }}
                            ></div>
                        </div>
                    </td>
                    <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleFlagProject({id})}
                                className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-800"
                                title="Flag Project"
                            >
                                <Flag size={16} />
                            </button>
                            <button
                                className="p-1.5 text-gray-400 hover:text-green-500 rounded-full hover:bg-gray-800"
                                title="Approve Project"
                                onClick={() => handleApprove({id})}

                            >
                                <CheckCircle size={16} />
                            </button>
                            <button
                                className="p-1.5 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-800"
                                title="View Project"
                            >
                                <Eye size={16} />
                            </button>
                        </div>
                    </td>
                </tr>
              
            </tbody>
        </>
    )
}

export default AdminProject