
'use client'
import { useState, useCallback, useEffect } from 'react';
import { fetchIPFSData } from '@/helper';
import { Milestone, MileStoneDetails } from '@/types';

export const useReadMileStones = (milestone: any[]) => {
    const [mileStone, setMileStone] = useState<Milestone | null>(null);
    const [mileStoneDetails, setMileStoneDetails] = useState<MileStoneDetails | null>(null);

    const formatMileStone = useCallback(() => {
        if (!milestone || !Array.isArray(milestone)) {
            console.log("milestone is empty or invalid:", milestone);
            return;
        }

        setMileStone({
            mileStoneURL: milestone[0],
            prove: milestone[1],
            isApproved: milestone[2],
            amount: Number(milestone[3]),
            completed: milestone[4]
        });
    }, [milestone]);

    const fetchProjectDetails = useCallback(async () => {
        if (!mileStone?.mileStoneURL) return;

        try {
            const data = await fetchIPFSData(mileStone?.mileStoneURL);
            setMileStoneDetails(data);
        } catch (error) {
            console.error('Error fetching project details:', error);
        }
    }, [mileStone?.mileStoneURL]);

    useEffect(() => {
        formatMileStone();
    }, [formatMileStone]);

    useEffect(() => {
        fetchProjectDetails();
    }, [fetchProjectDetails]);

    return { mileStone, mileStoneDetails}
}