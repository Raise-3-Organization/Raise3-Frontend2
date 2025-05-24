import React from 'react'
import { useMileStoneLen } from '@/hooks/useMileStonelength'
import MilestoneAccordion from './ProjectMilestone';

interface MileStoneIds {
    projectId: string;
    mileStoneCount: string;
}
const AllMileStone = ({ projectId, mileStoneCount }: MileStoneIds) => {

    const { mileStoneLength } = useMileStoneLen(Number(mileStoneCount));
  
  return (
    <div className=''>
        {[...mileStoneLength.entries()].map(([key, value]) => (
            <MilestoneAccordion key={key} projectId={projectId} mileStoneId={value} />
        ))}
    </div>
  )
}

export default AllMileStone