'use client'
import React, { useState } from 'react'
import ProjectView from '@/components/project/ProjectView'
import CreateMilestone from '@/components/milestone/CreateMilestone'
import { useParams } from 'next/navigation'
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
            <ProjectView />
            <button onClick={handleOpenMilestone}>Add Milestone</button>
            {isMilestoneOpen && <CreateMilestone onClose={handleCloseMilestone} projectId={params?.id as string} />}
        </>
    )
}

export default PreviewProject