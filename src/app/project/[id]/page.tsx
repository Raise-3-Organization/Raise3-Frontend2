'use client'
import React, { useState } from 'react'
import ProjectView from '@/components/project/ProjectView'
import CreateMilestone from '@/components/milestone/CreateMilestone'
import { useParams } from 'next/navigation'
import NavbarDashboard from '@/components/NavbarDashboard'
import ProjectMilestone from '@/components/milestone/ProjectMilestone'
import { useReadMileStone } from '@/hooks/useReadMileStone'
const PreviewProject = () => {
    const [isMilestoneOpen, setIsMilestoneOpen] = useState(false);
    const params = useParams();
    const handleOpenMilestone = () => {
        setIsMilestoneOpen(true);
    };

    const handleCloseMilestone = () => {
        setIsMilestoneOpen(false);
    };

    return (
        <>
        <NavbarDashboard />
            <ProjectView />
            <button onClick={handleOpenMilestone}>Add Milestone</button>
            {isMilestoneOpen && <CreateMilestone onClose={handleCloseMilestone} projectId={params?.id as string} />}

            {/* <ProjectMilestone milestone={"0"} index={"0"} /> */}
        </>
    )
}

export default PreviewProject