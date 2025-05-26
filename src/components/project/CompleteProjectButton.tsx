import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface CompleteProjectButtonProps {
  campaignStatus: number;
  onComplete: () => void;
}

const CompleteProjectButton: React.FC<CompleteProjectButtonProps> = ({
  campaignStatus,
  onComplete,
}) => {
  switch (campaignStatus) {
    case 0: // Review
      return (
        <button
          className="px-4 py-2 bg-gray-500/30 border border-gray-800/50 text-gray-400 rounded-lg font-medium transition-all duration-300 flex items-center"
          disabled
        >
          <FontAwesomeIcon icon={faCheckCircle} className="mr-2 h-4 w-4" />
          Under Review
        </button>
      );

    case 1: // Active
      return (
        <button
          onClick={onComplete}
          className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 flex items-center  bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500`}
        >
          <FontAwesomeIcon icon={faCheckCircle} className="mr-2 h-4 w-4" />
            Mark as Complete
        </button>
      );

    case 2: // Completed
      return (
        <button
          className="px-4 py-2 bg-green-500/30 border border-green-800/50 text-green-400 rounded-lg font-medium transition-all duration-300 flex items-center"
          disabled
        >
          <FontAwesomeIcon icon={faCheckCircle} className="mr-2 h-4 w-4" />
          Completed
        </button>
      );

    case 3: // Flagged
      return (
        <button
          className="px-4 py-2 bg-red-500/30 border border-red-800/50 text-red-400 rounded-lg font-medium transition-all duration-300 flex items-center"
          disabled
        >
          <FontAwesomeIcon icon={faCheckCircle} className="mr-2 h-4 w-4" />
          Flagged
        </button>
      );

    default:
      return null;
  }
};

export default CompleteProjectButton;