import { ethers } from 'ethers';
import Raise3MileStoneABI from '../abis/Raise3MileStone.json';

// Contract address for Lisk Sepolia testnet (chain ID 4202)
export const CONTRACT_ADDRESS = "0xAED8c5D4926109E87Aeb4D09bBBcbc457dB54E56";

export { Raise3MileStoneABI };

// Cache the contract instance to avoid repeated connection attempts
let cachedContract = null;
let cachedSigner = null;

// Utility function to create contract data for direct transactions
export const getCreateCampaignData = (metaUrl, goalAmount, initialRaised = 0) => {
  // Create contract interface
  const iface = new ethers.Interface(Raise3MileStoneABI);

  // Encode the function call
  return iface.encodeFunctionData(
    'createCampaign',
    [
      metaUrl,
      goalAmount,
      initialRaised
    ]
  );
};

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

// Read function - Get total number of campaigns
export const getCampaignsCount = async (provider) => {
  try {
    console.log("Getting campaigns count from contract at address:", CONTRACT_ADDRESS);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      Raise3MileStoneABI,
      provider
    );

    // Skip the problematic getCampaignLen() function and go straight to manual counting
    console.log("Using manual approach to count campaigns");
    let campaignCount = 0;
    let continueChecking = true;

    while (continueChecking && campaignCount < 100) { // Safety limit
      try {
        console.log(`Checking if campaign ${campaignCount} exists...`);
        await contract.getCampaignDetails(campaignCount);
        console.log(`Found valid campaign at index: ${campaignCount}`);
        campaignCount++;
      } catch (e) {
        console.log(`No more campaigns found at index ${campaignCount}:`, e.message);
        continueChecking = false;
      }
    }

    console.log(`Found ${campaignCount} campaigns through manual checking`);
    return campaignCount;
  } catch (error) {
    console.error("Error in getCampaignsCount:", error);
    return 0; // Return 0 if there's an error
  }
};

// Read function - Get campaign details
export const getCampaignDetails = async (provider, campaignId) => {
  try {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      Raise3MileStoneABI,
      provider
    );

    const details = await contract.getCampaignDetails(campaignId);
    return {
      metaUrl: details[0],
      goalAmount: details[1],
      totalRaised: details[2],
      founder: details[3],
      token: details[4]
    };
  } catch (error) {
    console.error(`Error getting campaign ${campaignId} details:`, error);
    throw error;
  }
};

// Read function - Get milestone details
export const getMilestoneDetails = async (provider, campaignId, milestoneId) => {
  try {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      Raise3MileStoneABI,
      provider
    );

    const milestone = await contract._milestones(campaignId, milestoneId);
    return {
      milestoneDescription: milestone.milestoneDescription,
      isApproved: milestone.isApproved,
      amount: milestone.amount,
      completed: milestone.completed
    };
  } catch (error) {
    console.error(`Error getting milestone details:`, error);
    throw error;
  }
};

// Read function - Get investor details
export const getInvestorDetails = async (provider, investorAddress) => {
  try {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      Raise3MileStoneABI,
      provider
    );

    const details = await contract.getInvestorDetails(investorAddress);
    return {
      amount: details[0],
      token: details[1],
      investorAddress: details[2],
      numberOfCampaign: details[3]
    };
  } catch (error) {
    console.error(`Error getting investor details:`, error);
    throw error;
  }
};

// FOUNDER FUNCTIONS

// Create a new campaign
export const createCampaign = async (signer, metaUrl, goalAmount, initialRaised = 0) => {
  try {
    console.log("Creating campaign with params:", { metaUrl, goalAmount });
    const contract = await getContract(signer);

    const tx = await contract.createCampaign(
      metaUrl,
      goalAmount,
      initialRaised,
      {
        gasLimit: 5000000 // Set appropriate gas limit
      }
    );

    console.log("Campaign creation transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Campaign created in block:", receipt.blockNumber);

    return tx;
  } catch (error) {
    console.error("Failed to create campaign:", error);
    throw error;
  }
};

// Add a milestone to an existing campaign
export const addMilestone = async (signer, campaignIndex, amount, description) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.addMilestone(
      campaignIndex,
      amount,
      description,
      {
        gasLimit: 3000000
      }
    );

    console.log("Add milestone transaction sent:", tx.hash);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(`Error adding milestone:`, error);
    throw error;
  }
};

// Mark a milestone as complete
export const completeMilestone = async (signer, campaignIndex, milestoneId) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.completeMilestone(
      campaignIndex,
      milestoneId,
      {
        gasLimit: 3000000
      }
    );

    console.log("Complete milestone transaction sent:", tx.hash);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(`Error completing milestone:`, error);
    throw error;
  }
};

// Withdraw funds from a completed milestone
export const withdrawMilestone = async (signer, campaignIndex, milestoneId) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.withdrawMilestone(
      campaignIndex,
      milestoneId,
      {
        gasLimit: 3000000
      }
    );

    console.log("Withdraw milestone transaction sent:", tx.hash);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(`Error withdrawing milestone funds:`, error);
    throw error;
  }
};

// INVESTOR FUNCTIONS

// Setup investor account
export const setupInvestorAccount = async (signer, amount, tokenAddress) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.foundInvestorAccount(
      amount,
      tokenAddress,
      {
        gasLimit: 3000000
      }
    );

    console.log("Setup investor account transaction sent:", tx.hash);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(`Error setting up investor account:`, error);
    throw error;
  }
};

// Invest in a campaign
export const investInCampaign = async (signer, campaignIndex, amount) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.founderCampaign(
      campaignIndex,
      amount,
      {
        gasLimit: 3000000
      }
    );

    console.log("Investment transaction sent:", tx.hash);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(`Error investing in campaign:`, error);
    throw error;
  }
};

// ADMIN FUNCTIONS

// Grant founder role to an address
export const grantFounderRole = async (signer, accountAddress) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.grantFounderRole(
      accountAddress,
      {
        gasLimit: 3000000
      }
    );

    console.log("Grant founder role transaction sent:", tx.hash);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(`Error granting founder role:`, error);
    throw error;
  }
};

// Grant investor role to an address
export const grantInvestorRole = async (signer, accountAddress, amount, tokenAddress) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.grantInvestorRole(
      accountAddress,
      amount,
      tokenAddress,
      {
        gasLimit: 3000000
      }
    );

    console.log("Grant investor role transaction sent:", tx.hash);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(`Error granting investor role:`, error);
    throw error;
  }
};

// Approve a campaign
export const approveCampaign = async (signer, campaignIndex) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.approveCampaign(
      campaignIndex,
      {
        gasLimit: 3000000
      }
    );

    console.log("Approve campaign transaction sent:", tx.hash);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(`Error approving campaign:`, error);
    throw error;
  }
};

// Approve a milestone
export const approveMilestone = async (signer, campaignIndex, milestoneIndex) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.approveMilestone(
      campaignIndex,
      milestoneIndex,
      {
        gasLimit: 3000000
      }
    );

    console.log("Approve milestone transaction sent:", tx.hash);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(`Error approving milestone:`, error);
    throw error;
  }
};

// Flag a campaign (e.g., for suspicious activity)
export const flagCampaign = async (signer, campaignIndex) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.flagCampaign(
      campaignIndex,
      {
        gasLimit: 3000000
      }
    );

    console.log("Flag campaign transaction sent:", tx.hash);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(`Error flagging campaign:`, error);
    throw error;
  }
};

// Complete a campaign 
export const completeCampaign = async (signer, campaignIndex) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.CompleteCampaign(
      campaignIndex,
      {
        gasLimit: 3000000
      }
    );

    console.log("Complete campaign transaction sent:", tx.hash);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(`Error completing campaign:`, error);
    throw error;
  }
};