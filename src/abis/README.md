# Working with the Raise3MileStone Smart Contract

This directory contains the ABI (Application Binary Interface) for the Raise3MileStone smart contract. This file is essential for interacting with the Ethereum-based smart contract from your JavaScript application.

## What is an ABI?

An ABI defines the methods and structures used to interact with your Ethereum smart contract. It's like an API specification that tells your JavaScript application how to format function calls and what to expect in return.

## How the ABI is Used in This Project

1. The ABI is imported in `src/utils/contractInterface.js` to create contract instances
2. The contract interface exposes methods that make it easier to interact with the smart contract
3. The contract context (`src/context/ContractContext.js`) wraps these methods for use throughout the app
4. Components like `ProjectList` and `ProjectActions` use the contract context

## Contract Functions Available

The Raise3MileStone contract provides these main functions:

### For Projects
- `getProjectsCount()` - Get number of projects
- `getProject(projectId)` - Get project details
- `submitProject(name, description, goal, milestones)` - Create new project

### For Donations
- `donateToProject(projectId, amount)` - Donate to a project

### For Milestones
- `createVoting(projectId, milestoneId)` - Create voting for milestone
- `vote(projectId, milestoneId, voteOption)` - Vote on milestone

### For Admins
- `approveProject(projectId)` - Approve project
- `rejectProject(projectId)` - Reject project
- `activateProject(projectId)` - Activate project
- `acceptProject(projectId)` - Accept project

## Data Structure

The contract uses these main data structures:

### Project
```solidity
struct Project {
    uint256 projectID;
    address owner;
    string projectName;
    string projectDescription;
    uint256 fundraisingGoal;
    uint256 totalFundRaised;
    uint256 remainingFund;
    uint256 submissionTime;
    bool isApproved;
    bool isRejected;
    bool isActive;
    bool isAccepted;
    MileStone[] milestones;
}
```

### Milestone
```solidity
struct MileStone {
    string milestoneName;
    string milestoneDescription;
    uint256 fundNeeded;
    bool isComplete;
    bool voting;
    bool isApproved;
    uint256 totalVoters;
    uint256 startDate;
    uint256 endDate;
}
```

## Setting Up

To use the smart contract in your development environment:

1. Create a `.env.local` file in the project root
2. Add your contract address: `NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress`
3. Restart your development server

For more detailed instructions, see `src/utils/setupContract.md`. 