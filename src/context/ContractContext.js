import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import * as contractInterface from '../utils/contractInterface';

/*
 * IMPORTANT: Set up your contract address in .env.local file:
 * 
 * NEXT_PUBLIC_CONTRACT_ADDRESS=0x123...your-actual-contract-address
 *
 * The contract address is accessed in src/utils/contractInterface.js
 */

const ContractContext = createContext();

export function useContract() {
  return useContext(ContractContext);
}

export function ContractProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [networkName, setNetworkName] = useState('unknown');

  // Helper function to get network name from chainId
  const getNetworkName = (chainId) => {
    if (!chainId) return 'unknown';
    
    // Convert chainId to number if it's a hex string
    const chainIdNum = typeof chainId === 'string' && chainId.startsWith('0x') 
      ? parseInt(chainId, 16) 
      : Number(chainId);
    
    const networks = {
      1: 'mainnet',
      3: 'ropsten',
      4: 'rinkeby',
      5: 'goerli',
      11155111: 'sepolia',
      42: 'kovan',
      56: 'bsc',
      97: 'bsc-testnet',
      137: 'polygon',
      80001: 'polygon-mumbai',
      42161: 'arbitrum',
      421611: 'arbitrum-rinkeby',
      10: 'optimism',
      69: 'optimism-kovan',
      31337: 'hardhat',
      1337: 'localhost',
    };
    
    return networks[chainIdNum] || `unknown-${chainIdNum}`;
  };

  // Connect to wallet
  const connectWallet = useCallback(async () => {
    try {
      setLoading(true);
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Get chain ID first
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        const chainIdNum = parseInt(chainIdHex, 16);
        setChainId(chainIdNum);
        
        // Set the network name
        const networkNameValue = getNetworkName(chainIdNum);
        setNetworkName(networkNameValue);
        console.log(`Connected to network: ${networkNameValue} (chainId: ${chainIdNum})`);
        
        // Create provider with fallback for unknown networks
        let provider;
        try {
          provider = new ethers.providers.Web3Provider(window.ethereum);
        } catch (error) {
          console.warn('Error creating Web3Provider:', error);
          // Fallback for unknown networks - create with a dummy network
          provider = new ethers.providers.Web3Provider(
            window.ethereum,
            {
              name: networkNameValue,
              chainId: chainIdNum
            }
          );
        }
        
        const signer = provider.getSigner();
        
        setProvider(provider);
        setSigner(signer);
        setAccount(accounts[0]);
        setIsConnected(true);
        
        console.log('Wallet connected successfully with account:', accounts[0]);
      } else {
        alert('Please install MetaMask to use this application');
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setIsConnected(false);
    setChainId(null);
    setNetworkName('unknown');
  }, []);

  // Auto-connect when ethereum is available and wallet is connected via Wagmi
  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum) {
        try {
          // Check if we already have permission to access accounts
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts && accounts.length > 0) {
            console.log('Auto-connecting to wallet with account:', accounts[0]);
            
            try {
              // Get chain ID first
              const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
              const chainIdNum = parseInt(chainIdHex, 16);
              setChainId(chainIdNum);
              
              // Set the network name
              const networkNameValue = getNetworkName(chainIdNum);
              setNetworkName(networkNameValue);
              console.log(`Connected to network: ${networkNameValue} (chainId: ${chainIdNum})`);
              
              // Create provider with fallback for unknown networks
              let provider;
              try {
                provider = new ethers.providers.Web3Provider(window.ethereum);
              } catch (error) {
                console.warn('Error creating Web3Provider:', error);
                // Fallback for unknown networks - create with a dummy network
                provider = new ethers.providers.Web3Provider(
                  window.ethereum,
                  {
                    name: networkNameValue,
                    chainId: chainIdNum
                  }
                );
              }
              
              const signer = provider.getSigner();
              
              setProvider(provider);
              setSigner(signer);
              setAccount(accounts[0]);
              setIsConnected(true);
              
              // Verification log to confirm we're connected
              console.log('Contract context connected successfully');
            } catch (providerError) {
              console.error('Error setting up provider or signer:', providerError);
              // Even if provider setup fails, we still have accounts connected
              setAccount(accounts[0]);
              setIsConnected(true);
            }
          } else {
            console.log('No connected accounts found during auto-connect');
          }
        } catch (error) {
          console.error('Error during auto-connect wallet process:', error);
        }
      } else {
        console.log('No ethereum object found - browser may not have wallet extension');
      }
    };

    autoConnect();
    
    // Set up periodic check to ensure connection stays valid
    const checkConnectionInterval = setInterval(() => {
      if (window.ethereum && !isConnected) {
        console.log('Performing periodic connection check');
        autoConnect();
      }
    }, 10000); // Check every 10 seconds if we're not connected
    
    return () => {
      clearInterval(checkConnectionInterval);
    };
  }, [isConnected]);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          
          // Update signer when account changes
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);
          setSigner(provider.getSigner());
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', async (chainIdHex) => {
        const chainIdNum = parseInt(chainIdHex, 16);
        setChainId(chainIdNum);
        
        // Update network name
        const networkNameValue = getNetworkName(chainIdNum);
        setNetworkName(networkNameValue);
        console.log(`Network changed: ${networkNameValue} (chainId: ${chainIdNum})`);
        
        // Reconnect to wallet on chain change
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            // Create provider with fallback for unknown networks
            let provider;
            try {
              provider = new ethers.providers.Web3Provider(window.ethereum);
            } catch (error) {
              console.warn('Error creating Web3Provider after chain change:', error);
              // Fallback for unknown networks - create with a dummy network
              provider = new ethers.providers.Web3Provider(
                window.ethereum,
                {
                  name: networkNameValue,
                  chainId: chainIdNum
                }
              );
            }
            
            const signer = provider.getSigner();
            setProvider(provider);
            setSigner(signer);
          }
        } catch (error) {
          console.error('Error reconnecting after chain change:', error);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [disconnectWallet]);

  // Contract functions wrapped with the current signer/provider
  const getProjectsCount = useCallback(async () => {
    if (!provider) return 0;
    try {
      return await contractInterface.getProjectsCount(provider);
    } catch (error) {
      console.warn("getProjectsCount failed, returning 0:", error.message);
      return 0;
    }
  }, [provider]);

  const getProject = useCallback(async (projectId) => {
    if (!provider) return null;
    return contractInterface.getProject(provider, projectId);
  }, [provider]);

  const submitProject = useCallback(async (name, description, goal, milestones) => {
    if (!signer) throw new Error('Wallet not connected');
    return contractInterface.submitProject(signer, name, description, goal, milestones);
  }, [signer]);

  const donateToProject = useCallback(async (projectId, amount) => {
    if (!signer) throw new Error('Wallet not connected');
    return contractInterface.donateToProject(signer, projectId, amount);
  }, [signer]);

  const voteOnMilestone = useCallback(async (projectId, milestoneId, voteOption) => {
    if (!signer) throw new Error('Wallet not connected');
    return contractInterface.voteOnMilestone(signer, projectId, milestoneId, voteOption);
  }, [signer]);

  const createVoting = useCallback(async (projectId, milestoneId) => {
    if (!signer) throw new Error('Wallet not connected');
    return contractInterface.createVoting(signer, projectId, milestoneId);
  }, [signer]);

  // Admin functions
  const approveProject = useCallback(async (projectId) => {
    if (!signer) throw new Error('Wallet not connected');
    return contractInterface.approveProject(signer, projectId);
  }, [signer]);

  const rejectProject = useCallback(async (projectId) => {
    if (!signer) throw new Error('Wallet not connected');
    return contractInterface.rejectProject(signer, projectId);
  }, [signer]);

  const activateProject = useCallback(async (projectId) => {
    if (!signer) throw new Error('Wallet not connected');
    return contractInterface.activateProject(signer, projectId);
  }, [signer]);

  const acceptProject = useCallback(async (projectId) => {
    if (!signer) throw new Error('Wallet not connected');
    return contractInterface.acceptProject(signer, projectId);
  }, [signer]);

  const value = {
    provider,
    signer,
    account,
    isConnected,
    chainId,
    networkName,
    loading,
    connectWallet,
    disconnectWallet,
    getProjectsCount,
    getProject,
    submitProject,
    donateToProject,
    voteOnMilestone,
    createVoting,
    approveProject,
    rejectProject,
    activateProject,
    acceptProject
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
}

export default ContractProvider; 