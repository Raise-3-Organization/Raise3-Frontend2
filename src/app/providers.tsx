"use client";

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, sepolia, liskSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected, walletConnect } from '@wagmi/connectors';
import { cookieStorage, createStorage } from '@wagmi/core';
import { ContractProvider } from '../context/ContractContext';

// Set up WalletConnect projectId
const projectId = '1eebe528ca0ce94a99ceaa2e915058d7';

// Create persistent storage with a custom key
const storage = createStorage({
  storage: cookieStorage,
  key: 'raise3-wallet', // Custom key for better isolation
});

// Create wagmi config with better disconnection handling
const config = createConfig({
  chains: [mainnet, sepolia, liskSepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
[liskSepolia.id]: http("https://rpc.sepolia-api.lisk.com"),
  },
  connectors: [
    injected({
      shimDisconnect: true,
      // Handle wallets that may not fully implement EIP-1193
      unstable_shimAsyncInject: true,
    }),
    walletConnect({ 
      projectId,
      showQrModal: true,
    }),
  ],
  storage,
  multiInjectedProviderDiscovery: true,
});

// Create a client for react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class">
          <ContractProvider>
            {children}
          </ContractProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 