'use client'
import React from 'react'

import { useReadProjects } from '@/hooks/useReadProjects';
import { useProjectDetails } from '@/hooks/useProjectDetails'
import { useAccount } from 'wagmi';
import SkeletonLoader from './SkeletonLoader';
// import { formatAddress } from '@/lib/utils';
interface ProjectId {
    id: string;
  }
const ProjectCard = ({ id }: ProjectId) => {

    const { projects, isProjectLoading } = useReadProjects(id)
    const { project, projectDetails } = useProjectDetails(projects as any[]);
    const { address } = useAccount();

    if (isProjectLoading) {
        return <SkeletonLoader />
      }



  return (
    <div
            className="border border-gray-800 rounded-lg p-4 shadow-sm"
          >
            <h2 className="text-xl font-bold">{projectDetails?.projectName}</h2>
            <p className="text-gray-600 mt-2">{projectDetails?.description}</p>
            <div className="mt-4">
              <p>Goal: goal ETH</p>
              <p>Raised: raised ETH</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      (parseFloat(String(project?.totalRaised) || "") /
                        parseFloat(String(project?.goalAmount) || "")) *
                        100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-medium">
                Founder: {project?.founder?.substring(0, 6)}...{project?.founder?.substring(38)}
              </p>
              <p className="font-medium">
                Milestones: length
                {/* {formattedProject.milestones.length} */}
              </p>
            </div>
          </div>
  )
}

export default ProjectCard