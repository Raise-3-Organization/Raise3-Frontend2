import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClock, faMoneyBill, faCalendarDay, faChevronUp, faChevronDown, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useReadMileStones } from '@/hooks/useReadMileStones';
import { useReadMileStone } from '@/hooks/useReadMileStone';
import { useRoles } from '@/hooks/useRoles';
import { useAccount, useWriteContract } from 'wagmi';
import { contractAddress } from "@/contants"
import Raise3Abi from "@/abis/Raise3MileStone.json";


interface MileStoneProps {
  projectId: string;
  mileStoneId: string;
}

const MilestoneAccordion = ({ projectId, mileStoneId }: MileStoneProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { isInvestorRole } = useRoles(address as `0x${string}`);

  const { mileStone } = useReadMileStone({
    projectId: projectId, mileStoneId: mileStoneId
  })

  const approveMilestone = async () => {

    try {

      if (!isInvestorRole) {
        console.error("You do not have permission to approve this milestone.");
        return;
      }

      const response = await writeContractAsync({
        address: contractAddress,
        abi: Raise3Abi,
        functionName: 'hasRole',
        args: [projectId, mileStoneId]
      })

    } catch (error) {
      console.log("Error approving milestone:", error);
    }
  }


  console.log("mileStone", mileStone);
  const { mileStoneDetails } = useReadMileStones(mileStone as any[]);
  console.log("mileStoneDetails", mileStoneDetails);
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FontAwesomeIcon icon={faCheck} className="text-green-500 h-[14px]" />;
      case 'in-progress':
        return <FontAwesomeIcon icon={faSpinner} className="text-blue-500 h-[14px]" />;
      default: // pending
        return <FontAwesomeIcon icon={faClock} className="text-yellow-500 h-[14px]" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900/30 border-green-800/50 text-green-400';
      case 'in-progress':
        return 'bg-blue-900/30 border-blue-800/50 text-blue-400';
      default: // pending
        return 'bg-yellow-900/30 border-yellow-800/50 text-yellow-400';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all bg-gradient-to-b from-gray-900/50 to-black/30">
      {/* Accordion Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-800 rounded-full text-white font-medium">
            {/* {mileStone?} */}
          </div>
          <div>
            <h3 className="text-white font-medium">{mileStoneDetails?.title}</h3>
            <div className="flex items-center mt-1 space-x-3">
              {/* TODO: might change this to Enum in contract or use bool */}
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full border flex items-center ${getStatusBadgeColor(mileStoneDetails?.status || 'pending')}`}>
                {getStatusIcon(mileStoneDetails?.status || 'pending')}
                <span className="ml-1 capitalize">{mileStoneDetails?.status.replace('-', ' ')}</span>
              </span>

              {mileStoneDetails?.targetDate && (
                <span className="text-xs text-gray-400 flex items-center">
                  <FontAwesomeIcon icon={faCalendarDay} className="mr-1 h-[12px]" />
                  Due: {formatDate(mileStoneDetails?.targetDate)}
                </span>
              )}
            </div>
          </div>
        </div>

        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="text-gray-400 h-[16px]"
        />
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-800 space-y-4">
          {/* Description */}
          {mileStoneDetails?.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-1">Description</h4>
              <p className="text-gray-400 text-sm bg-black/30 p-3 rounded-lg">
                {mileStoneDetails?.description}
              </p>
            </div>
          )}

          {/* Deliverables */}
          {mileStoneDetails?.deliverables && mileStoneDetails?.deliverables.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Deliverables</h4>
              <ul className="space-y-1.5">
                {mileStoneDetails?.deliverables.map((deliverable, i) => (
                  <li key={i} className="flex items-start">
                    <FontAwesomeIcon icon={faCheck} className="text-gray-500 mr-2 mt-1 h-[12px]" />
                    <span className="text-sm text-gray-400">{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Budget if exists */}
          {mileStoneDetails?.budget && (
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <FontAwesomeIcon icon={faMoneyBill} className="text-green-500 mr-1 h-[14px]" />
              <span>Budget: {mileStoneDetails?.budget} {mileStoneDetails?.budgetCurrency || 'USD'}</span>
            </div>
          )}
          <div className=' flex space-x-4'>
            {Boolean(isInvestorRole) && (
              <button className="px-4 py-2 bg-green-900/30 border border-green-800/50 text-green-400 rounded-lg hover:bg-green-800/50 transition-all" onClick={approveMilestone}>
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                Approve
              </button>
            )}

            {/* <button className="px-4 py-2 bg-red-900/30 border border-red-800/50 text-red-400 rounded-lg hover:bg-red-800/50 transition-all">
              Reject
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};


export default MilestoneAccordion