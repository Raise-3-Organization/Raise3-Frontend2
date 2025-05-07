"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAccount, useWalletClient, usePublicClient, useChainId } from 'wagmi';
import { ethers } from 'ethers';
import * as contractInterface from '../utils/contractInterface';

// Create the contract context
const ContractContext = createContext();

// Provider component that wraps the app and makes contract available to all child components
export function ContractProvider({ children }) {
  // State for campaign count
  const [campaignsCount, setCampaignsCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(false);
  const [error, setError] = useState(null);
  
  // Wagmi hooks for blockchain connection
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: publicClient } = usePublicClient();
  const chainId = useChainId(); // Use the useChainId hook directly
  
  // Create a ref to cache the provider
  const providerRef = useRef(null);
  
  // Set log verbosity - change to false to reduce console logs
  const VERBOSE_LOGGING = false;
  
  // Utility function for conditional logging
  const logDebug = (message, ...args) => {
    if (VERBOSE_LOGGING) {
      console.log(message, ...args);
    }
  };

  // Get ethers provider from wagmi publicClient
  const getProvider = useCallback(() => {
    if (!publicClient) {
      return null;
    }
    
    // Return cached provider if available and chain hasn't changed
    if (providerRef.current && providerRef.current._chainId === chainId) {
      logDebug("Using cached provider for chain ID:", chainId);
      return providerRef.current;
    }
    
    // Create a new provider compatible with ethers.js Contract
    const provider = {
      _chainId: chainId,
      getCode: async (address) => {
        try {
          return await publicClient.getCode({ address });
        } catch (e) {
          console.error("Error in getCode:", e);
          return "0x"; // Return empty code on error
        }
      },
      call: async (transaction) => {
        try {
          const { to, data } = transaction;
          const result = await publicClient.call({
            to,
            data,
          });
          return result.data || "0x";
        } catch (e) {
          console.error("Error in call:", e);
          throw e;
        }
      },
      getBlockNumber: async () => {
        try {
          const blockNumber = await publicClient.getBlockNumber();
          return BigInt(blockNumber.toString());
        } catch (e) {
          console.error("Error in getBlockNumber:", e);
          return BigInt(0);
        }
      },
    };
    
    // Cache the provider
    providerRef.current = provider;
    
    return provider;
  }, [publicClient, chainId]);

  // Get a signer from walletClient
  const getSigner = useCallback(() => {
    if (!walletClient || !address) {
      return null;
    }
    
    const signer = {
      provider: getProvider(),
      _address: address,
      getAddress: async () => address,
      signMessage: async (message) => {
        return await walletClient.signMessage({ message });
      },
      sendTransaction: async (transaction) => {
        const { to, data, value } = transaction;
        const hash = await walletClient.sendTransaction({
          to,
          data,
          value,
          account: address,
        });
        return { hash };
      },
    };
    
    return signer;
  }, [walletClient, address, getProvider]);

  // Refresh campaign count
  const refreshCampaignCount = useCallback(async () => {
    if (!isConnected) {
      setCampaignsCount(0);
      return;
    }
    
    setLoadingCount(true);
    setError(null);
    
    try {
      const provider = getProvider();
      if (!provider) {
        throw new Error("Provider not available");
      }
      
      const count = await contractInterface.getCampaignsCount(provider);
      logDebug("Got campaign count:", count);
      setCampaignsCount(count);
    } catch (err) {
      console.error("Error fetching campaign count:", err);
      setError(err.message || "Error fetching campaign count");
    } finally {
      setLoadingCount(false);
    }
  }, [isConnected, getProvider]);

  // Get campaign details by ID
  const getCampaignDetails = useCallback(async (campaignId) => {
    try {
      const provider = getProvider();
      if (!provider) {
        throw new Error("Provider not available");
      }
      
      return await contractInterface.getCampaignDetails(provider, campaignId);
    } catch (err) {
      console.error(`Error fetching campaign ${campaignId} details:`, err);
      setError(err.message || "Error fetching campaign details");
      return null;
    }
  }, [getProvider]);

  // Batch get multiple campaigns
  const batchGetCampaigns = useCallback(async (startId = 0, count = 10) => {
    try {
      const provider = getProvider();
      if (!provider) {
        throw new Error("Provider not available");
      }
      
      const results = [];
      const endId = Math.min(startId + count, campaignsCount);
      
      for (let i = startId; i < endId; i++) {
        try {
          const campaign = await contractInterface.getCampaignDetails(provider, i);
          if (campaign) {
            results.push({ ...campaign, id: i });
          }
        } catch (e) {
          console.error(`Error fetching campaign ${i}:`, e);
        }
      }
      
      return results;
    } catch (err) {
      console.error("Error batch fetching campaigns:", err);
      setError(err.message || "Error batch fetching campaigns");
      return [];
    }
  }, [getProvider, campaignsCount]);

  // Create a new campaign
  const createCampaign = useCallback(async (metaUrl, goalAmount, initialRaised = 0) => {
    try {
      const signer = getSigner();
      if (!signer) {
        throw new Error("Signer not available");
      }
      
      const result = await contractInterface.createCampaign(
        signer,
        metaUrl,
        ethers.utils.parseEther(goalAmount.toString()),
        ethers.utils.parseEther(initialRaised.toString())
      );
      
      // Refresh campaign count after successful creation
      await refreshCampaignCount();
      
      return result;
    } catch (err) {
      console.error("Error creating campaign:", err);
      setError(err.message || "Error creating campaign");
      return null;
    }
  }, [getSigner, refreshCampaignCount]);

  // Add a milestone to a campaign
  const addMilestone = useCallback(async (campaignId, amount, description) => {
    try {
      const signer = getSigner();
      if (!signer) {
        throw new Error("Signer not available");
      }
      
      return await contractInterface.addMilestone(
        signer,
        campaignId,
        ethers.utils.parseEther(amount.toString()),
        description
      );
    } catch (err) {
      console.error("Error adding milestone:", err);
      setError(err.message || "Error adding milestone");
      return null;
    }
  }, [getSigner]);

  // Mark a milestone as complete
  const completeMilestone = useCallback(async (campaignId, milestoneId) => {
    try {
      const signer = getSigner();
      if (!signer) {
        throw new Error("Signer not available");
      }
      
      return await contractInterface.completeMilestone(signer, campaignId, milestoneId);
    } catch (err) {
      console.error("Error completing milestone:", err);
      setError(err.message || "Error completing milestone");
      return null;
    }
  }, [getSigner]);

  // Withdraw funds from a milestone
  const withdrawMilestone = useCallback(async (campaignId, milestoneId) => {
    try {
      const signer = getSigner();
      if (!signer) {
        throw new Error("Signer not available");
      }
      
      return await contractInterface.withdrawMilestone(signer, campaignId, milestoneId);
    } catch (err) {
      console.error("Error withdrawing from milestone:", err);
      setError(err.message || "Error withdrawing from milestone");
      return null;
    }
  }, [getSigner]);

  // Invest in a campaign
  const investInCampaign = useCallback(async (campaignId, amount) => {
    try {
      const signer = getSigner();
      if (!signer) {
        throw new Error("Signer not available");
      }
      
      return await contractInterface.investInCampaign(
        signer,
        campaignId,
        ethers.utils.parseEther(amount.toString())
      );
    } catch (err) {
      console.error("Error investing in campaign:", err);
      setError(err.message || "Error investing in campaign");
      return null;
    }
  }, [getSigner]);

  // Donate directly to a project
  const donateToProject = useCallback(async (projectId, amount) => {
    try {
      const signer = getSigner();
      if (!signer) {
        throw new Error("Signer not available");
      }
      
      return await contractInterface.donateToProject(
        signer,
        projectId,
        ethers.utils.parseEther(amount.toString())
      );
    } catch (err) {
      console.error("Error donating to project:", err);
      setError(err.message || "Error donating to project");
      return null;
    }
  }, [getSigner]);

  // Project submission wrapper function
  const submitProject = useCallback(async (projectData) => {
    try {
      if (!isConnected) {
        throw new Error("Wallet not connected");
      }
      
      const signer = getSigner();
      if (!signer) {
        throw new Error("Signer not available");
      }
      
      console.log("Submitting project data:", projectData);
      
      // Create metadata object that will be stored as JSON
      const metadata = {
        name: projectData.name,
        description: projectData.description,
        socialLinks: projectData.socialMedia || {},
        contactInfo: projectData.contactInfo || {},
        team: projectData.team || { members: [] },
        stage: projectData.projectStage?.stage || "Seed",
        businessModel: projectData.projectStage?.businessModel || "",
        problem: projectData.problem || "",
        solution: projectData.solution || "",
        mission: projectData.mission || "",
        location: projectData.location || "",
        createdAt: new Date().toISOString()
      };
      
      // For the multi-step form, format the data properly
      const metaUrl = `ipfs://local/${address}_${Date.now()}`; // This would be replaced with actual IPFS upload
      const goalAmount = projectData.projectStage?.raisedAmount || "1";
      
      // Call the createCampaign function
      const result = await createCampaign(
        metaUrl,
        goalAmount,
        "0" // Initial raised amount
      );
      
      console.log("Project submitted successfully:", result);
      return result;
    } catch (err) {
      console.error("Error submitting project:", err);
      throw err;
    }
  }, [isConnected, address, getSigner, createCampaign]);

  // Context value with all contract methods
  const contextValue = {
    isConnected,
    address,
    campaignsCount,
    isLoading: loadingCount,
    error,
    
    // Methods
    getCampaignDetails,
    batchGetCampaigns,
    createCampaign,
    addMilestone,
    completeMilestone,
    withdrawMilestone,
    investInCampaign,
    donateToProject,
    refreshCampaignCount,
    submitProject, // Added project submission function
  };

  return (
    <ContractContext.Provider value={contextValue}>
      {children}
    </ContractContext.Provider>
  );
}

// Hook for components to get access to the contract context
export const useContract = () => {
  return useContext(ContractContext);
};
