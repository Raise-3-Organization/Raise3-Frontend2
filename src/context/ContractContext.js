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
      call: (tx) => publicClient.call(tx),
      getStorageAt: (address, slot) => publicClient.getStorageAt({ address, slot }),
      getCode: (address) => publicClient.getCode({ address }),
      getBalance: (address) => publicClient.getBalance({ address }),
      getTransactionCount: (address) => publicClient.getTransactionCount({ address }),
      getBlock: (blockHashOrNumber) => publicClient.getBlock({ blockHashOrNumber }),
      getTransaction: (hash) => publicClient.getTransaction({ hash }),
      getTransactionReceipt: (hash) => publicClient.getTransactionReceipt({ hash }),
      // Some ethers-specific functions mapped to publicClient
      getNetwork: () => ({ chainId: chainId }),
      getGasPrice: () => publicClient.getGasPrice?.() || Promise.resolve(0),
      estimateGas: (tx) => publicClient.estimateGas(tx),
      
      // Add a dummy provider.provider property for ethers Contract compatibility
      provider: {},
      
      // Add this to allow detection as a provider
      _isProvider: true
    };
    
    // Store the provider in the ref
    providerRef.current = provider;
    
    logDebug("Created new provider for chain ID:", chainId);
    return provider;
  }, [publicClient, chainId, logDebug]);

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

      // Get our provider
      const provider = getProvider();
      
      // Create a custom ethers signer from walletClient that's compatible with ethers Contract
      const customSigner = {
        _address: address,
        provider: provider,
        getAddress: () => Promise.resolve(address),
        signMessage: (message) => walletClient.signMessage({ message }),
        signTransaction: (tx) => walletClient.signTransaction(tx),
        sendTransaction: async (tx) => {
          console.log("Sending transaction with custom signer:", tx);
          try {
            const { to, data, value } = tx;
            const hash = await walletClient.sendTransaction({
              to,
              data,
              value,
              account: address,
              chain: undefined, // Let wallet use current chain instead of specifying
            });
            console.log("Transaction hash:", hash);
            return {
              hash,
              wait: async (confirmations = 1) => {
                console.log(`Waiting for ${confirmations} confirmations`);
                // Return a minimal receipt
                return { 
                  blockNumber: "pending",
                  transactionHash: hash,
                  status: 1
                };
              }
            };
          } catch (txError) {
            console.error("Transaction error:", txError);
            throw txError;
          }
        },
        // Add a connect method that returns self
        connect: () => customSigner,
        // Make it look like a proper ethers signer
        _isSigner: true
      };

      console.log("Created custom signer for address:", address, "on chain ID:", chainId);
      return customSigner;
    } catch (error) {
      console.error("Error creating signer:", error);
      throw new Error("Failed to create signer: " + error.message);
    }
  }, [walletClient, isConnected, address, chainId, getProvider]);

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

  // Get campaign details with batch fetching capability
  const getCampaignDetails = useCallback(async (campaignId) => {
    if (!publicClient) {
      throw new Error("Provider not available");
    }
    const provider = getProvider();
    logDebug(`Fetching details for campaign ID ${campaignId} using provider`);
    return contractInterface.getCampaignDetails(provider, campaignId);
  }, [getProvider, publicClient, logDebug]);
  
  // Batch fetch multiple campaigns at once
  const batchGetCampaigns = useCallback(async (startId, count) => {
    if (!publicClient) {
      throw new Error("Provider not available");
    }
    
    const provider = getProvider();
    if (!provider) {
      throw new Error("Provider not available");
    }
    
    // Create an array of promises to fetch campaigns in parallel
    const promises = [];
    for (let i = startId; i < startId + count; i++) {
      promises.push(
        contractInterface.getCampaignDetails(provider, i)
          .catch(err => {
            logDebug(`Error fetching campaign ${i}:`, err.message);
            return null;
          })
      );
    }
    
    // Wait for all promises to settle
    const results = await Promise.allSettled(promises);
    
    // Filter out rejections and extract values from fulfilled promises
    return results
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value);
  }, [getProvider, publicClient, logDebug]);

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

  // Donate to a project
  const donateToProject = useCallback(async (projectId, amount) => {
    try {
      const signer = await getSigner();
      return contractInterface.donateToProject(signer, projectId, amount);
    } catch (error) {
      console.error("Donate to project error:", error);
      throw error;
    }
  }, [getSigner]);

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
    donateToProject,
    batchGetCampaigns,
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