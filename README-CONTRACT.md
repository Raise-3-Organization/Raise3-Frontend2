# Raise3 Contract Integration

This document explains how the Raise3MileStone smart contract is integrated with the frontend application.

## Setup

1. The contract ABI is stored in `src/abis/Raise3MileStone.json`
2. The contract interface is defined in `src/utils/contractInterface.js`
3. The React context for using the contract is in `src/context/ContractContext.js`

## Configuring the Contract Address

Set the contract address in the `.env.local` file in the root of your project:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x123...your-actual-contract-address
```

## Components for Interacting with the Contract

1. `ProjectList.jsx` - Displays a list of projects from the contract
2. `ProjectActions.jsx` - Provides forms for creating projects and donating to them

## Integration in the Dashboard

The contract components have been integrated in the following places:

1. The `BrowseProjects` component in the investor dashboard uses `ProjectList.jsx` to display on-chain projects
2. The `CreateProject` component in the founder dashboard uses `ProjectActions.jsx` to create projects on-chain

## Available Contract Functions

### Read Functions
- `getProjectsCount()` - Get the number of projects
- `getProject(projectId)` - Get details about a specific project

### Write Functions
- `submitProject(name, description, goal, milestones)` - Create a new project
- `donateToProject(projectId, amount)` - Donate to a project
- `voteOnMilestone(projectId, milestoneId, voteOption)` - Vote on a milestone
- `createVoting(projectId, milestoneId)` - Create a voting for a milestone

### Admin Functions
- `approveProject(projectId)` - Approve a project
- `rejectProject(projectId)` - Reject a project
- `activateProject(projectId)` - Activate a project
- `acceptProject(projectId)` - Accept a project

## Using the Contract in Components

Import the contract hook in your components:

```jsx
import { useContract } from '../context/ContractContext';

const MyComponent = () => {
  const { 
    isConnected, 
    getProjectsCount, 
    getProject, 
    submitProject 
  } = useContract();
  
  // Use these functions in your component
};
```

## Error Handling

All contract functions include error handling. Wrap your contract calls in try/catch blocks:

```jsx
try {
  const result = await getProject(projectId);
  // Handle successful result
} catch (error) {
  console.error("Error:", error);
  // Handle error
}
```

## Wallet Connection

The contract context includes wallet connection functionality:

```jsx
const { connectWallet, disconnectWallet, isConnected, account } = useContract();

// Connect wallet
<button onClick={connectWallet}>Connect Wallet</button>

// Display account if connected
{isConnected && <p>Connected: {account}</p>}

// Disconnect wallet
<button onClick={disconnectWallet}>Disconnect</button>
``` 