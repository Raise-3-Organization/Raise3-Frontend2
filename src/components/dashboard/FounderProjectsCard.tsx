'use client'
import React from 'react'
import { useReadProjects } from '@/hooks/useReadProjects';
import { useProjectDetails } from '@/hooks/useProjectDetails'
import { useAccount } from 'wagmi';
import SkeletonLoader from './SkeletonLoader';


interface ProjectId {
  id: string;
}

const FounderProjectsCard = ({ id }: ProjectId) => {


  const { projects, isProjectLoading } = useReadProjects(id)
  const { project, projectDetails } = useProjectDetails(projects as any[]);
  const { address } = useAccount();

  if (!projects) {
    return <div>No Project is available current</div>
  }

  if (isProjectLoading) {
    return <SkeletonLoader />
  }

  // console.log("projects", projects)
  return (
    <>
    
    
      {
        address == project?.founder ? (<>
          <div className="border border-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{projectDetails?.projectName}</h3>
                <p className="text-sm text-gray-400 mt-1">{projectDetails?.projectType} • {projectDetails?.network}</p>
              </div>
              <div className="bg-green-900/30 text-green-500 text-xs px-2 py-1 rounded-full">
                Active
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Progress</span>
                <span className="font-medium">75%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-[#2F50FF] to-[#FF7171] h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm">
              <span className="text-gray-400">${project?.totalRaised}raised of {project?.goalAmount}</span>
              <button className="text-[#FF7171] font-medium hover:underline">Manage</button>
            </div>
          </div>
        </>) : "No Project yet, add project"
      }

   </>
  )
}

export default FounderProjectsCard