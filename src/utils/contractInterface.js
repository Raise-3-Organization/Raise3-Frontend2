import { ethers } from 'ethers';
import Raise3MileStoneABI from '../abis/Raise3MileStone.json';

// Contract address from environment variable or fallback
// Using a known Sepolia testnet address as fallback for development
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

// Cache the contract instance to avoid repeated connection attempts
let cachedContract = null;
let cachedSigner = null;

export const getContract = async (signer) => {
  try {
    // Return cached contract if we have one for the same signer
    if (cachedContract && cachedSigner && 
        cachedSigner._address === signer._address) {
      console.log("Using cached contract instance");
      return cachedContract;
    }
    
    console.log("Getting contract at address:", CONTRACT_ADDRESS);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      Raise3MileStoneABI,
      signer
    );
    
    // Cache the contract and signer for future use
    cachedContract = contract;
    cachedSigner = signer;
    
    // Log available functions for debugging
    console.log("Contract functions:", Object.keys(contract.functions || {}).join(", "));
    
    return contract;
  } catch (error) {
    console.error("Error getting contract:", error);
    throw error;
  }
};

// Contract read functions
export const getProjectsCount = async (provider) => {
  try {
    console.log("Getting projects count from contract");
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      Raise3MileStoneABI,
      provider
    );
    
    // Try standard getProjectsCount first
    try {
      const count = await contract.getProjectsCount();
      return count.toNumber();
    } catch (countError) {
      console.log("Standard getProjectsCount failed, trying alternatives:", countError.message);
      
      // Try alternative approaches from documentation
      try {
        // Try getCampaignLen from documentation
        if (typeof contract.getCampaignLen === 'function') {
          console.log("Trying getCampaignLen() instead");
          const count = await contract.getCampaignLen();
          return count.toNumber();
        }
        
        // Fallback to returning zero
        console.log("No project count function found, returning 0");
        return 0;
      } catch (altError) {
        console.error("Alternative methods failed too:", altError.message);
        return 0;
      }
    }
  } catch (error) {
    console.error("Error getting projects count:", error);
    // Return 0 instead of throwing - this allows the UI to continue working
    return 0;
  }
};

export const getProject = async (provider, projectId) => {
  try {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      Raise3MileStoneABI,
      provider
    );
    const project = await contract.getProject(projectId);
    return project;
  } catch (error) {
    console.error(`Error getting project ${projectId}:`, error);
    throw error;
  }
};

// Contract write functions
export const submitProject = async (signer, name, description, goal, milestones) => {
  try {
    console.log("Starting project submission with direct approach");
    
    // Force wallet connection to trigger popup if needed
    if (window.ethereum) {
      console.log("Requesting wallet accounts to trigger popup");
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (walletError) {
        console.log("Wallet account request:", walletError.message);
      }
    }
    
    // Get signer's address
    const signerAddress = await signer.getAddress();
    console.log("Signer address:", signerAddress);
    
    // Create a simplified contract instance with just the function we need
    const contractABI = [
      "function submitProject(string name, string description, uint256 goal, tuple(string milestoneName, string milestoneDescription, uint256 fundNeeded, bool isComplete, bool voting, bool isApproved, uint256 totalVoters, uint256 startDate, uint256 endDate)[] milestones) returns (bool)"
    ];
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    
    // Format milestone data properly
    const formattedMilestones = milestones.map(m => [
      m.milestoneName || "", 
      m.milestoneDescription || "", 
      m.fundNeeded || ethers.utils.parseEther("0"), 
      false, 
      false, 
      false, 
      ethers.BigNumber.from(0), 
      ethers.BigNumber.from(0), 
      ethers.BigNumber.from(0)
    ]);
    
    console.log("Sending transaction with these parameters:", {
      name,
      description,
      goal: goal.toString(),
      milestonesCount: formattedMilestones.length
    });
    
    // Use a very high gas limit to bypass estimation
    const options = {
      gasLimit: 10000000 // 10 million gas should be more than enough
    };
    
    console.log("Submitting transaction...");
    
    // Make the actual call with a timeout to detect if wallet isn't responding
    let walletPromptTimeout = setTimeout(() => {
      console.log("Wallet confirmation taking longer than expected. Check if your wallet popup is hidden or blocked.");
    }, 3000);
    
    // Make the actual call
    const tx = await contract.submitProject(
      name,
      description,
      goal,
      formattedMilestones,
      options
    );
    
    // Clear timeout as wallet responded
    clearTimeout(walletPromptTimeout);
    
    console.log("Transaction sent! Hash:", tx.hash);
    console.log("Waiting for confirmation...");
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    
    return tx;
  } catch (error) {
    console.error("Failed to submit project:", error);
    
    // Check for common error types
    if (error.code === 4001) {
      throw new Error("Transaction rejected in wallet");
    } else if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
      throw new Error("Contract rejected the transaction - check that your inputs are valid and you have the correct permissions");
    } else if (error.message && error.message.includes("transaction")) {
      throw new Error(`Transaction error: ${error.message}`);
    }
    
    throw error;
  }
};

export const submitProjectWithRawSignature = async (signer, name, description, goal, milestones) => {
  try {
    // Get a low-level contract without the high-level ethers.js interface
    const address = CONTRACT_ADDRESS;
    const abi = ['function submitProject(string,string,uint256,(string,string,uint256,bool,bool,bool,uint256,uint256,uint256)[]) returns (bool)'];
    const contract = new ethers.Contract(address, abi, signer);
    
    console.log("Using raw ABI with specific function signature");
    
    // Manually format the milestone data to match exactly what the contract expects
    const formattedMilestones = milestones.map(m => [
      m.milestoneName,
      m.milestoneDescription,
      m.fundNeeded,
      false, // isComplete
      false, // voting
      false, // isApproved
      0,     // totalVoters
      0,     // startDate
      0      // endDate
    ]);
    
    // Call with manual gas limit
    const tx = await contract.submitProject(
      name,
      description,
      goal,
      formattedMilestones,
      {
        gasLimit: 10000000 // Very high gas limit
      }
    );
    
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error with raw signature:", error);
    throw error;
  }
};

export const donateToProject = async (signer, projectId, amount) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.donateToken(projectId, amount);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(`Error donating to project ${projectId}:`, error);
    throw error;
  }
};

export const voteOnMilestone = async (signer, projectId, milestoneId, voteOption) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.vote(projectId, milestoneId, voteOption);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(`Error voting on milestone:`, error);
    throw error;
  }
};

export const createVoting = async (signer, projectId, milestoneId) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.createVoting(projectId, milestoneId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(`Error creating voting:`, error);
    throw error;
  }
};

// Admin functions
export const approveProject = async (signer, projectId) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.approveProject(projectId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(`Error approving project ${projectId}:`, error);
    throw error;
  }
};

export const rejectProject = async (signer, projectId) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.rejectProject(projectId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(`Error rejecting project ${projectId}:`, error);
    throw error;
  }
};

export const activateProject = async (signer, projectId) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.activateProject(projectId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(`Error activating project ${projectId}:`, error);
    throw error;
  }
};

export const acceptProject = async (signer, projectId) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.acceptProject(projectId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(`Error accepting project ${projectId}:`, error);
    throw error;
  }
}; 