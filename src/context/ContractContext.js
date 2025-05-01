"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAccount, useWalletClient, usePublicClient, useChainId } from 'wagmi';
import { ethers } from 'ethers';
import * as contractInterface from '../utils/contractInterface';

// Create the contract context
const ContractContext = createContext();

// Provider component that wraps the app and makes contract available to all child components
export function ContractProvider({ children }) {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId(); // Get current chain ID

  const [campaignsCount, setCampaignsCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(false);
  const [error, setError] = useState(null);

  // Custom signer creation based on wagmi wallet client
  const getSigner = useCallback(async () => {
    try {
      if (!isConnected || !walletClient || !address) {
        console.error("Wallet not connected, missing required data:", {
          isConnected,
          hasWalletClient: !!walletClient,
          hasAddress: !!address
        });
        throw new Error("Wallet not connected");
      }

      // Create a custom ethers signer from walletClient
      const customSigner = {
        _address: address,
        provider: null,
        getAddress: () => Promise.resolve(address),
        signMessage: (message) => walletClient.signMessage({ message }),
        signTransaction: (tx) => walletClient.signTransaction(tx),
        sendTransaction: (tx) => {
          const { to, data, value } = tx;
          return walletClient.sendTransaction({
            to,
            data,
            value,
            account: address,
            chain: undefined, // Let wallet use current chain instead of specifying
          });
        },
        // Add other methods as needed
        connect: () => customSigner,
      };

      console.log("Created custom signer for address:", address, "on chain ID:", chainId);
      return customSigner;
    } catch (error) {
      console.error("Error creating signer:", error);
      throw new Error("Failed to create signer: " + error.message);
    }
  }, [walletClient, isConnected, address, chainId]);

  // Create a readonly provider from public client for read operations
  const getProvider = useCallback(() => {
    if (!publicClient) return null;

    // We don't need to create a full ethers provider for read operations
    // Instead, we can just use the public client directly wrapped in a minimal interface
    return {
      call: (tx) => publicClient.call(tx),
      getBalance: (address) => publicClient.getBalance({ address }),
      getBlockNumber: () => publicClient.getBlockNumber(),
      getCode: (address) => publicClient.getCode({ address }),
      getStorageAt: (address, position) =>
        publicClient.getStorageAt({ address, slot: position }),
      // Add other methods as needed for your contract reads
    };
  }, [publicClient]);

  // Fetch campaign count
  useEffect(() => {
    const fetchCampaignCount = async () => {
      const provider = getProvider();
      if (!provider) return;

      try {
        setLoadingCount(true);
        setError(null);

        // Use getCampaignsCount without chainId parameter
        const count = await contractInterface.getCampaignsCount(provider);
        setCampaignsCount(count);
      } catch (error) {
        console.error("Failed to fetch campaign count:", error);
        setError("Failed to load campaign count");
      } finally {
        setLoadingCount(false);
      }
    };

    if (isConnected) {
      fetchCampaignCount();
    }
  }, [getProvider, isConnected]);

  // Submit project function
  const submitProject = useCallback(async (name, description, goalAmount, milestones = []) => {
    try {
      console.log("Submit Project called with:", { name, description });
      console.log("Current chain ID:", chainId);

      if (!isConnected) {
        throw new Error("Wallet not connected");
      }

      console.log("Getting signer...");
      const signer = await getSigner();
      console.log("Signer obtained for address:", signer._address);

      // Create metadata
      const metaUrl = JSON.stringify({
        name,
        description,
        milestones: milestones.map(m => ({
          name: m.milestoneName,
          description: m.milestoneDescription,
          amount: m.fundNeeded.toString()
        }))
      });

      console.log("Creating project with metadata:", metaUrl.substring(0, 100) + "...");

      // Use CONTRACT_ADDRESS directly
      const tx = {
        to: contractInterface.CONTRACT_ADDRESS,
        data: contractInterface.getCreateCampaignData(metaUrl, goalAmount, 0),
        value: 0,
        // Don't specify chainId, let the wallet use current chain
      };

      console.log("Sending transaction to contract address:", contractInterface.CONTRACT_ADDRESS);
      const txHash = await signer.sendTransaction(tx);
      console.log("Transaction sent with hash:", txHash);

      // Return a transaction receipt-like object
      return {
        hash: txHash,
        wait: async (confirmations = 1) => {
          console.log(`Waiting for ${confirmations} confirmations`);
          // In a real implementation, you would wait for confirmations
          return { blockNumber: "pending" };
        }
      };
    } catch (error) {
      console.error("Submit project error:", error);
      throw error;
    }
  }, [getSigner, isConnected, chainId]);

  // Create a new campaign
  const createCampaign = useCallback(async (metaUrl, goalAmount, initialRaised = 0) => {
    try {
      const signer = await getSigner();
      return contractInterface.createCampaign(signer, metaUrl, goalAmount, initialRaised);
    } catch (error) {
      console.error("Create campaign error:", error);
      throw error;
    }
  }, [getSigner]);

  // Add a milestone to an existing campaign
  const addMilestone = useCallback(async (campaignIndex, amount, description) => {
    try {
      const signer = await getSigner();
      return contractInterface.addMilestone(signer, campaignIndex, amount, description);
    } catch (error) {
      console.error("Add milestone error:", error);
      throw error;
    }
  }, [getSigner]);

  // Get campaign details
  const getCampaignDetails = useCallback(async (campaignId) => {
    if (!publicClient) {
      throw new Error("Provider not available");
    }
    const provider = getProvider();
    return contractInterface.getCampaignDetails(provider, campaignId);
  }, [getProvider, publicClient]);

  // Get milestone details
  const getMilestoneDetails = useCallback(async (campaignId, milestoneId) => {
    if (!publicClient) {
      throw new Error("Provider not available");
    }
    const provider = getProvider();
    return contractInterface.getMilestoneDetails(provider, campaignId, milestoneId);
  }, [getProvider, publicClient]);

  // Get investor details
  const getInvestorDetails = useCallback(async (investorAddress) => {
    if (!publicClient) {
      throw new Error("Provider not available");
    }
    const provider = getProvider();
    return contractInterface.getInvestorDetails(provider, investorAddress || address);
  }, [getProvider, publicClient, address]);

  // Add other contract functions...

  // Context value with all contract functions
  const value = {
    isConnected,
    campaignsCount,
    loadingCount,
    error,
    chainId,
    submitProject,
    createCampaign,
    addMilestone,
    getCampaignDetails,
    getMilestoneDetails,
    getInvestorDetails,
    // Include all other functions here
    // ...
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
}

// Hook to use the contract context in components
export function useContract() {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
}