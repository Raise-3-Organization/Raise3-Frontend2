import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useContract } from '../context/ContractContext';

// This component handles initializing contract state when the app loads
// and refreshes data when the wallet connection changes
const ContractInitializer = () => {
  const { isConnected, address } = useAccount();
  const { refreshCampaignCount } = useContract();
  const [initialized, setInitialized] = useState(false);

  // Refresh contract data when wallet connection changes
  useEffect(() => {
    // Only run this once per connection change
    if (isConnected && !initialized) {
      console.log('Contract initializer - refreshing data for address:', address);
      
      // Refresh campaign count when connected
      refreshCampaignCount();
      
      // Mark as initialized
      setInitialized(true);
    } else if (!isConnected) {
      // Reset initialized state when disconnected
      setInitialized(false);
    }
  }, [isConnected, address, refreshCampaignCount, initialized]);

  // This is a non-visual component, so return null
  return null;
};

export default ContractInitializer;
