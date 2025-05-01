# Setting Up Your Smart Contract Address

To connect your frontend with the Raise3MileStone smart contract, follow these steps:

## 1. Create a .env.local file

Create a file named `.env.local` in the root directory of your project with the following content:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourActualContractAddress
```

Replace `0xYourActualContractAddress` with your deployed contract address.

## 2. Restart your development server

After creating or updating the `.env.local` file, restart your development server:

```bash
npm run dev
```

## 3. Verify the integration

The integration is now complete:

- The BrowseProjects component in the investor dashboard now displays projects from the blockchain
- The CreateProject component allows founders to create new on-chain projects
- All contract interactions are handled through the ContractContext provider

## Deployed Contract Information

If you're using the test environment, you can use this contract address for testing:

```
Contract Address: 0x123...your-test-contract-address
Network: Sepolia Testnet
```

Note: Make sure your wallet is connected to the same network as the deployed contract. 