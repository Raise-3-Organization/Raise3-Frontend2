'use client'
import React, { useState } from 'react'
import ProjectView from '@/components/project/ProjectView'
import ProjectActions from '@/components/ProjectActions'
import CreateMilestone from '@/components/milestone/CreateMilestone'

const PreviewProject = () => {
    const [isMilestoneOpen, setIsMilestoneOpen] = useState(false);

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
            {isMilestoneOpen && <CreateMilestone onClose={handleCloseMilestone} />}
        </>
    )
}

export default PreviewProject