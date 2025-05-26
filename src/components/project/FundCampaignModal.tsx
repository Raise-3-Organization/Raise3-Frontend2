'use client';

import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faDollarSign, 
  faCoins, 
  faSpinner, 
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { useRoles } from '@/hooks/useRoles';
import { useWriteContract, useAccount } from 'wagmi';
import Raise3Abi from "@/abis/Raise3MileStone.json";
import { contractAddress } from '@/contants';

interface FundCampaignModalProps {
  onClose: () => void;
  projectName: string;
  projectId: string;
}

const FundCampaignModal: React.FC<FundCampaignModalProps> = ({ 
  onClose, 
  projectName,
  projectId
}) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { address } = useAccount();
  const { isInvestorRole } = useRoles(address as `0x${string}`);

  const { writeContractAsync } = useWriteContract()


  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    setAmount(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate amount
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Simulate API call to process funding
     if(isInvestorRole){
      await writeContractAsync({
        abi: Raise3Abi,
        address: contractAddress,
        functionName: 'fundProject',
        args: [projectId, amount]
      })
    }
      // Show success message
      setShowSuccessMessage(true);
      
      // Close modal after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error funding campaign:', err);
      setError('Failed to process your funding. Please try again or get role');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className="relative w-full max-w-md mx-auto">
        <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-xl border border-gray-800 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Fund Campaign</h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 mb-4 text-red-200 text-sm flex items-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 mr-2 text-red-400" />
                {error}
              </div>
            )}

            {showSuccessMessage ? (
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-5 text-center">
                <FontAwesomeIcon icon={faCheckCircle} className="h-12 w-12 text-green-400 mb-3" />
                <h3 className="text-xl font-medium text-white mb-2">Funding Successful!</h3>
                <p className="text-green-200">
                  Thank you for your contribution of {amount} {currency} to "{projectName}".
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6">
                    <h3 className="text-blue-200 font-medium mb-1">Funding Project</h3>
                    <p className="text-blue-300 font-bold text-lg">{projectName}</p>
                  </div>

                  <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                    Amount to Fund<span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faDollarSign} className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="amount"
                        value={amount}
                        onChange={handleAmountChange}
                        className="pl-10 w-full px-4 py-3 bg-[#0A0A0A] border border-gray-800 rounded-l-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="px-4 py-3 bg-[#0A0A0A] border border-gray-800 border-l-0 rounded-r-lg text-white focus:ring-2 focus:ring-[#FF7171]/50 transition-all duration-200 min-w-[80px]"
                    >
                      {/* TODO: Add currencies token address */}
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="ETH">ETH</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-4 mb-5 border border-gray-800">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Transaction Fee</span>
                    <span className="text-white">2.5%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-400">You will contribute</span>
                    <span className="text-white font-medium">
                      {amount ? (parseFloat(amount) * 1.025).toFixed(2) : '0.00'} {currency}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 font-medium transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-[#FF7171] to-[#FF5C87] hover:from-[#FF5C87] hover:to-[#FF7171] rounded-lg text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2 h-4 w-4" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCoins} className="mr-2 h-4 w-4" />
                        Fund Project
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundCampaignModal;
