'use client'
import { useState, useCallback, useEffect } from 'react';
import { fetchIPFSData } from '@/helper';
import { ProjectInterface, BusinessModel } from '@/types'; // Import your interfaces

export const useProjectDetails = (projects: any[]) => {
    const [project, setProject] = useState<ProjectInterface | null>(null);
    const [projectDetails, setProjectDetails] = useState<BusinessModel | null>(null);

    const formatProject = useCallback(() => {
        if (!projects || !Array.isArray(projects)) {
            console.log("projects are empty or invalid:", projects);
            return;
        }

        setProject({
            metaURL: projects[0],
            goalAmount: Number(projects[1]),
            totalRaised: Number(projects[2]),
            founder: projects[3],
            tokenAddress: projects[4],
            milestoneCount: Number(projects[5]),
            CampaignStatus: Number(projects[6])
        });
    }, [projects]);

    const fetchProjectDetails = useCallback(async () => {
        if (!project?.metaURL) return;

        try {
            const data = await fetchIPFSData(project.metaURL);
            setProjectDetails(data);
        } catch (error) {
            console.error('Error fetching project details:', error);
        }
    }, [project?.metaURL]);

    useEffect(() => {
        fetchProjectDetails();
    }, [ fetchProjectDetails]);

    useEffect(() => {
        formatProject();
    }, [formatProject]);

    return { project, projectDetails };
};