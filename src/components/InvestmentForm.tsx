"use client";

import React, { useState } from 'react';
import { useRecordInvestment } from '@/lib/hooks/useInvestments';
import { useAuthContext } from '@/context/AuthContext';

interface InvestmentFormProps {
  campaignId: string;
  tokenSymbol?: string;
  tokenPrice?: number;
  onSuccess?: () => void;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({
  campaignId,
  tokenSymbol,
  tokenPrice,
  onSuccess
}) => {
  const [amount, setAmount] = useState<number>(100);
  const { user, isAuthenticated } = useAuthContext();
  
  const { mutate: recordInvestment, isPending, error } = useRecordInvestment();
  
  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please connect your wallet to invest');
      return;
    }
    
    // Calculate token amount if token price is available
    const tokenAmount = tokenPrice ? amount / tokenPrice : undefined;
    
    recordInvestment({
      campaignId,
      amount,
      tokenAmount,
      transactionHash: 'placeholder_tx_hash' // In a real app, this would come from a blockchain transaction
    }, {
      onSuccess: () => {
        if (onSuccess) {
          onSuccess();
        }
        setAmount(100);
      }
    });
  };
  
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Invest in this Campaign</h3>
      
      <form onSubmit={handleInvest}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Investment Amount (USD)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              disabled={isPending}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>
          
          {tokenSymbol && tokenPrice && (
            <p className="mt-2 text-sm text-gray-500">
              You will receive approximately {(amount / tokenPrice).toFixed(2)} {tokenSymbol} tokens.
            </p>
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error instanceof Error ? error.message : 'Failed to process investment. Please try again.'}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isPending || !isAuthenticated}
        >
          {isPending ? 'Processing...' : isAuthenticated ? 'Invest Now' : 'Connect Wallet to Invest'}
        </button>
      </form>
    </div>
  );
};

export default InvestmentForm; 