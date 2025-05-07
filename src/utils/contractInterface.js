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
  const iface = new ethers.utils.Interface(Raise3MileStoneABI);

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
    // Check if signer is valid
    if (!signer || !signer._address) {
      console.error("Invalid signer provided:", signer);
      throw new Error("Invalid signer");
    }

    // Ensure the signer has a provider
    if (!signer.provider) {
      console.error("Signer does not have a provider:", signer);
      throw new Error("Signer missing provider");
    }
    
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
    // Enhanced provider validation
    if (!provider) {
      console.log("No provider available, cannot get campaigns count");
      return 0;
    }

    // Ensure provider has required methods
    if (!provider.call || typeof provider.call !== 'function') {
      console.log("Invalid provider: missing required methods");
      return 0;
    }

    console.log("Getting campaigns count from contract at address:", CONTRACT_ADDRESS);
    
    // Try direct call to contract with minimal setup
    try {
      // Create a minimal contract interface for just getProjectsCount
      const countAbi = ["function getProjectsCount() view returns (uint256)"];
      const countInterface = new ethers.utils.Interface(countAbi);
      
      // Encode the function call
      const data = countInterface.encodeFunctionData("getProjectsCount", []);
      
      // Call the function directly using provider.call
      const rawResult = await provider.call({
        to: CONTRACT_ADDRESS,
        data: data
      });
      
      // Decode the result
      if (rawResult && typeof rawResult === 'string') {
        console.log("Got raw count result:", rawResult);
        try {
          // Try to decode the result using the ABI
          const decodedResult = countInterface.decodeFunctionResult("getProjectsCount", rawResult);
          const count = decodedResult[0].toNumber();
          console.log("Decoded count:", count);
          return count;
        } catch (decodeError) {
          console.log("Error decoding result with ABI:", decodeError.message);
          
          // Try direct hex parsing if possible
          if (rawResult.startsWith('0x')) {
            try {
              // Remove '0x' prefix and convert from hex to decimal
              const hexValue = rawResult.slice(2);
              // Extract the last 64 characters (32 bytes) which typically contain the uint256 value
              const valueHex = hexValue.slice(-64);
              const count = parseInt(valueHex, 16);
              if (!isNaN(count)) {
                console.log("Parsed count from raw hex:", count);
                return count;
              }
            } catch (hexError) {
              console.log("Error parsing hex value:", hexError.message);
            }
          }
        }
      } else if (rawResult && typeof rawResult === 'object') {
        // Handle object response format (sometimes returned by certain providers)
        console.log("Got object format result:", JSON.stringify(rawResult));
        
        // Try to extract data from object if it has a data field
        if (rawResult.data && typeof rawResult.data === 'string') {
          try {
            // Extract hex data and convert to number
            const hexData = rawResult.data.slice(2); // Remove 0x prefix
            // If the data field contains the full 32 bytes value
            const lastBytes = hexData.slice(-64); // Take last 32 bytes (64 hex chars)
            const count = parseInt(lastBytes, 16);
            if (!isNaN(count)) {
              console.log("Parsed count from data object:", count);
              return count;
            }
          } catch (dataError) {
            console.log("Error parsing data object:", dataError.message);
          }
        }
      }
      
      // If we got here, we couldn't parse the result, fall back to standard methods
      throw new Error("Could not parse direct call result, trying standard methods");
      
    } catch (directCallError) {
      console.log("Direct call to getProjectsCount failed:", directCallError.message);
      
      // Try standard contract method as fallback
      try {
        console.log("Attempting standard contract methods...");
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Raise3MileStoneABI,
          provider
        );
        
        // Try getProjectsCount
        if (typeof contract.getProjectsCount === 'function') {
          try {
            console.log("Trying contract.getProjectsCount()");
            const result = await contract.getProjectsCount();
            
            // Handle different response formats
            if (typeof result === 'object' && result._isBigNumber) {
              const count = result.toNumber();
              console.log("Got BigNumber count:", count);
              return count;
            } else if (typeof result === 'object' && result.data) {
              // Handle case where result is an object with data property
              console.log("Got data object:", JSON.stringify(result));
              try {
                // Try to extract the hex value
                const hexData = result.data.slice(2); // Remove 0x prefix
                const count = parseInt(hexData.slice(-64), 16); // Take last 32 bytes
                if (!isNaN(count)) {
                  console.log("Parsed count from data property:", count);
                  return count;
                }
              } catch (dataError) {
                console.log("Error parsing data object:", dataError.message);
              }
            } else if (typeof result === 'number') {
              console.log("Got number directly:", result);
              return result;
            } else if (typeof result === 'string' && result.startsWith('0x')) {
              // Handle hex string
              const count = parseInt(result.slice(2), 16);
              if (!isNaN(count)) {
                console.log("Parsed count from hex string:", count);
                return count;
              }
            }
            
            console.log("Unhandled result type:", typeof result, "value:", result);
            throw new Error("Unhandled result format");
          } catch (getCountError) {
            console.log("getProjectsCount failed:", getCountError.message);
            // Continue to next method
          }
        }
        
        // Try getCampaignLen as fallback
        if (typeof contract.getCampaignLen === 'function') {
          try {
            console.log("Trying contract.getCampaignLen()");
            const result = await contract.getCampaignLen();
            
            if (typeof result === 'object' && result._isBigNumber) {
              const count = result.toNumber();
              console.log("Got BigNumber count from getCampaignLen:", count);
              return count;
            } else if (typeof result === 'number') {
              console.log("Got number directly from getCampaignLen:", result);
              return result;
            } else if (typeof result === 'object' && result.data) {
              try {
                const hexData = result.data.slice(2);
                const count = parseInt(hexData.slice(-64), 16);
                if (!isNaN(count)) {
                  console.log("Parsed count from getCampaignLen data:", count);
                  return count;
                }
              } catch (lenDataError) {
                console.log("Error parsing getCampaignLen data:", lenDataError.message);
              }
            }
            
            console.log("Unhandled getCampaignLen result type:", typeof result);
            throw new Error("Unhandled result format for getCampaignLen");
          } catch (lenError) {
            console.log("getCampaignLen failed:", lenError.message);
          }
        }
        
        console.log("All fallback methods failed. Returning default count 0");
        return 0;
      } catch (e) {
        console.log("Error in standard contract methods:", e.message);
        return 0;
      }
    }
  } catch (error) {
    console.error("Error getting campaigns count:", error);
    return 0;
  }
};

// Read function - Get campaign details
export const getCampaignDetails = async (provider, campaignId) => {
  try {
    if (!provider) {
      console.log("No provider available, cannot get campaign details");
      return null;
    }
    
    console.log(`Getting details for campaign ID: ${campaignId}`);
    
    try {
      // First try making direct calls to the contract
      const getDetailsAbi = ["function getProjectDetails(uint256 projectId) view returns (address, string, uint256, uint256, uint256, uint256, bool)"];
      const detailsInterface = new ethers.utils.Interface(getDetailsAbi);
      
      // Encode the function call
      const data = detailsInterface.encodeFunctionData("getProjectDetails", [campaignId]);
      
      // Make the call
      const rawResult = await provider.call({
        to: CONTRACT_ADDRESS,
        data: data
      });
      
      if (rawResult && typeof rawResult === 'string') {
        try {
          // Try to decode the result using the ABI
          const decodedResult = detailsInterface.decodeFunctionResult("getProjectDetails", rawResult);
          
          // Map results to a proper object
          const campaign = {
            owner: decodedResult[0],
            metaUrl: decodedResult[1],
            goal: ethers.utils.formatEther(decodedResult[2]),
            raised: ethers.utils.formatEther(decodedResult[3]),
            milestonesCount: decodedResult[4].toNumber(),
            investorsCount: decodedResult[5].toNumber(),
            isCompleted: decodedResult[6]
          };
          
          console.log(`Campaign ${campaignId} details:`, campaign);
          return campaign;
        } catch (decodeError) {
          console.log("Error decoding campaign details:", decodeError.message);
          // Fallback to standard contract method
          throw new Error("Decode error, trying standard method");
        }
      } else {
        throw new Error("Invalid result format, trying standard method");
      }
    } catch (directCallError) {
      console.log("Direct call for campaign details failed:", directCallError.message);
      
      // Try using standard contract methods as fallback
      try {
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Raise3MileStoneABI,
          provider
        );
        
        // Get campaign details
        if (typeof contract.getProjectDetails === 'function') {
          const result = await contract.getProjectDetails(campaignId);
          
          // Map results to a proper object
          const campaign = {
            owner: result[0],
            metaUrl: result[1],
            goal: ethers.utils.formatEther(result[2]),
            raised: ethers.utils.formatEther(result[3]),
            milestonesCount: result[4].toNumber(),
            investorsCount: result[5].toNumber(),
            isCompleted: result[6]
          };
          
          console.log(`Campaign ${campaignId} details (standard method):`, campaign);
          return campaign;
        } else {
          throw new Error("getProjectDetails function not available");
        }
      } catch (standardMethodError) {
        console.log("Standard method for campaign details failed:", standardMethodError.message);
        throw standardMethodError;
      }
    }
  } catch (error) {
    console.error(`Error getting campaign ${campaignId} details:`, error);
    return null;
  }
};

// Read function - Get milestone details
export const getMilestoneDetails = async (provider, campaignId, milestoneId) => {
  try {
    if (!provider) return null;
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      Raise3MileStoneABI,
      provider
    );
    
    const milestone = await contract.getMilestoneDetails(campaignId, milestoneId);
    return {
      amount: ethers.utils.formatEther(milestone[0]),
      description: milestone[1],
      isCompleted: milestone[2],
      isApproved: milestone[3],
      isWithdrawn: milestone[4]
    };
  } catch (error) {
    console.error(`Error getting milestone details:`, error);
    return null;
  }
};

// Read function - Get investor details
export const getInvestorDetails = async (provider, investorAddress) => {
  try {
    if (!provider) return null;
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      Raise3MileStoneABI,
      provider
    );
    
    const details = await contract.getInvestorDetails(investorAddress);
    return {
      amount: ethers.utils.formatEther(details[0]),
      projectsCount: details[1].toNumber(),
      isRegistered: details[2]
    };
  } catch (error) {
    console.error(`Error getting investor details:`, error);
    return null;
  }
};

// FOUNDER FUNCTIONS

// Create a new campaign
export const createCampaign = async (signer, metaUrl, goalAmount, initialRaised = 0) => {
  try {
    if (!signer) return null;
    
    const contract = await getContract(signer);
    console.log(`Creating campaign with:
      MetaURL: ${metaUrl}
      Goal: ${goalAmount.toString()}
      Initial raised: ${initialRaised.toString()}
    `);
    
    const tx = await contract.createCampaign(
      metaUrl,
      goalAmount,
      initialRaised
    );
    
    console.log("Campaign creation transaction:", tx.hash);
    return tx;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
};

// Add a milestone to an existing campaign
export const addMilestone = async (signer, campaignIndex, amount, description) => {
  try {
    if (!signer) return null;
    
    const contract = await getContract(signer);
    console.log(`Adding milestone to campaign ${campaignIndex}:
      Amount: ${amount.toString()}
      Description: ${description}
    `);
    
    const tx = await contract.addMilestone(
      campaignIndex,
      amount,
      description
    );
    
    return tx;
  } catch (error) {
    console.error("Error adding milestone:", error);
    throw error;
  }
};

// Mark a milestone as complete
export const completeMilestone = async (signer, campaignIndex, milestoneId) => {
  try {
    if (!signer) return null;
    
    const contract = await getContract(signer);
    console.log(`Marking milestone ${milestoneId} complete for campaign ${campaignIndex}`);
    
    const tx = await contract.completeMilestone(
      campaignIndex,
      milestoneId
    );
    
    return tx;
  } catch (error) {
    console.error("Error completing milestone:", error);
    throw error;
  }
};

// Withdraw funds from a completed milestone
export const withdrawMilestone = async (signer, campaignIndex, milestoneId) => {
  try {
    if (!signer) return null;
    
    const contract = await getContract(signer);
    console.log(`Withdrawing from milestone ${milestoneId} for campaign ${campaignIndex}`);
    
    const tx = await contract.withdrawMilestone(
      campaignIndex,
      milestoneId
    );
    
    return tx;
  } catch (error) {
    console.error("Error withdrawing from milestone:", error);
    throw error;
  }
};

// INVESTOR FUNCTIONS

// Setup investor account
export const setupInvestorAccount = async (signer, amount, tokenAddress) => {
  try {
    if (!signer) return null;
    
    const contract = await getContract(signer);
    console.log(`Setting up investor account:
      Amount: ${amount.toString()}
      Token address: ${tokenAddress}
    `);
    
    const tx = await contract.setupInvestorAccount(
      amount,
      tokenAddress
    );
    
    return tx;
  } catch (error) {
    console.error("Error setting up investor account:", error);
    throw error;
  }
};

// Invest in a campaign
export const investInCampaign = async (signer, campaignIndex, amount) => {
  try {
    if (!signer) return null;
    
    const contract = await getContract(signer);
    console.log(`Investing in campaign ${campaignIndex}:
      Amount: ${amount.toString()}
    `);
    
    const tx = await contract.investInCampaign(
      campaignIndex,
      amount
    );
    
    return tx;
  } catch (error) {
    console.error("Error investing in campaign:", error);
    throw error;
  }
};

// ADMIN FUNCTIONS

// Grant founder role to an address
export const grantFounderRole = async (signer, accountAddress) => {
  try {
    if (!signer) return null;
    
    const contract = await getContract(signer);
    console.log(`Granting founder role to: ${accountAddress}`);
    
    const tx = await contract.grantFounderRole(
      accountAddress
    );
    
    return tx;
  } catch (error) {
    console.error("Error granting founder role:", error);
    throw error;
  }
};

// Grant investor role to an address
export const grantInvestorRole = async (signer, accountAddress, amount, tokenAddress) => {
  try {
    if (!signer) return null;
    
    const contract = await getContract(signer);
    console.log(`Granting investor role to: ${accountAddress}
      Amount: ${amount.toString()}
      Token address: ${tokenAddress}
    `);
    
    const tx = await contract.grantInvestorRole(
      accountAddress,
      amount,
      tokenAddress
    );
    
    return tx;
  } catch (error) {
    console.error("Error granting investor role:", error);
    throw error;
  }
};

// Approve a campaign
export const approveCampaign = async (signer, campaignIndex) => {
  try {
    if (!signer) return null;
    
    const contract = await getContract(signer);
    console.log(`Approving campaign ${campaignIndex}`);
    
    const tx = await contract.approveCampaign(
      campaignIndex
    );
    
    return tx;
  } catch (error) {
    console.error("Error approving campaign:", error);
    throw error;
  }
};

// Approve a milestone
export const approveMilestone = async (signer, campaignIndex, milestoneIndex) => {
  try {
    if (!signer) return null;
    
    const contract = await getContract(signer);
    console.log(`Approving milestone ${milestoneIndex} for campaign ${campaignIndex}`);
    
    const tx = await contract.approveMilestone(
      campaignIndex,
      milestoneIndex
    );
    
    return tx;
  } catch (error) {
    console.error("Error approving milestone:", error);
    throw error;
  }
};

// Flag a campaign (e.g., for suspicious activity)
export const flagCampaign = async (signer, campaignIndex) => {
  try {
    if (!signer) return null;
    
    const contract = await getContract(signer);
    console.log(`Flagging campaign ${campaignIndex}`);
    
    const tx = await contract.flagCampaign(
      campaignIndex
    );
    
    return tx;
  } catch (error) {
    console.error("Error flagging campaign:", error);
    throw error;
  }
};

// Complete a campaign
export const completeCampaign = async (signer, campaignIndex) => {
  try {
    if (!signer) return null;
    
    const contract = await getContract(signer);
    console.log(`Completing campaign ${campaignIndex}`);
    
    const tx = await contract.completeCampaign(
      campaignIndex
    );
    
    return tx;
  } catch (error) {
    console.error("Error completing campaign:", error);
    throw error;
  }
};

// Enhanced donation function with better error handling and detailed logging
export const donateToProject = async (signer, projectId, amount) => {
  try {
    if (!signer) {
      throw new Error("Invalid signer: null or undefined");
    }
    
    // Make sure signer has necessary properties
    if (!signer._address || !signer.sendTransaction) {
      console.error("Invalid signer format:", Object.keys(signer));
      throw new Error("Signer doesn't have required properties");
    }
    
    // Validate inputs
    if (projectId === undefined || projectId === null) {
      throw new Error("Invalid project ID: " + projectId);
    }
    
    if (!amount || amount.toString() === '0') {
      throw new Error("Invalid donation amount: must be greater than 0");
    }
    
    console.log(`Preparing to donate to project:
      Project ID: ${projectId}
      Amount: ${amount.toString()}
      Sender: ${signer._address}
    `);
    
    // Get contract instance - with retry logic
    let contract = null;
    let retries = 3;
    let lastError = null;
    
    while (retries > 0 && !contract) {
      try {
        contract = await getContract(signer);
        if (!contract) throw new Error("Failed to get contract instance");
      } catch (e) {
        lastError = e;
        console.warn(`Contract retrieval attempt failed, retries left: ${retries-1}`);
        retries--;
        // Small delay between retries
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    if (!contract) {
      throw lastError || new Error("Failed to get contract after multiple retries");
    }
    
    // Validate contract has the expected function
    if (!contract.donateToProject) {
      console.error("Contract methods available:", Object.keys(contract.functions || {}));
      throw new Error("Contract doesn't have donateToProject function");
    }
    
    console.log("Executing donation transaction...");
    
    // Execute the transaction
    const tx = await contract.donateToProject(
      projectId,
      { value: amount }
    );
    
    console.log("Donation transaction initiated:", tx.hash);
    
    // Return immediately with the transaction hash
    return {
      hash: tx.hash,
      wait: async () => {
        try {
          console.log("Waiting for donation transaction confirmation...");
          const receipt = await tx.wait();
          console.log("Donation transaction confirmed:", receipt);
          return receipt;
        } catch (waitError) {
          console.error("Error waiting for donation confirmation:", waitError);
          throw waitError;
        }
      }
    };
  } catch (error) {
    console.error("Error in donateToProject:", error);
    
    // Enhance error for UI display
    const errorMessage = error.message || "Unknown error in donation process";
    const enhancedError = new Error(`Donation failed: ${errorMessage}`);
    enhancedError.originalError = error;
    enhancedError.code = error.code;
    throw enhancedError;
  }
};

// Batch get multiple campaigns for improved performance
export const batchGetCampaigns = async (provider, startIdx = 0, count = 5) => {
  try {
    if (!provider) {
      console.log("No provider available for batch fetching campaigns");
      return [];
    }
    
    console.log(`Batch fetching campaigns from ${startIdx} to ${startIdx + count - 1}`);
    
    // Get total campaign count
    const totalCount = await getCampaignsCount(provider);
    
    // Ensure we don't exceed total count
    const actualCount = Math.min(count, totalCount - startIdx);
    
    if (actualCount <= 0) {
      console.log("No campaigns to fetch in specified range");
      return [];
    }
    
    // Create array of promises for parallel fetching
    const promises = [];
    for (let i = 0; i < actualCount; i++) {
      const campaignId = startIdx + i;
      promises.push(getCampaignDetails(provider, campaignId));
    }
    
    // Wait for all promises to resolve
    const results = await Promise.all(promises);
    
    // Filter out null results and add campaign IDs
    const campaigns = results
      .map((campaign, index) => {
        if (!campaign) return null;
        
        return {
          ...campaign,
          id: startIdx + index
        };
      })
      .filter(campaign => campaign !== null);
    
    console.log(`Successfully fetched ${campaigns.length} campaigns`);
    return campaigns;
  } catch (error) {
    console.error("Error in batch fetching campaigns:", error);
    return [];
  }
};
