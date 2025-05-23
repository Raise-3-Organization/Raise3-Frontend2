"use client";

import { ReactNode, useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { ContractProvider } from '@/context/ContractContext';

// RainbowKit imports
import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { type Chain, mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletRedirector } from '@/components/walletConnection/WalletRedirector';

// Set up custom theme options for RainbowKit with our brand colors
const customThemeColors = {
  accentColor: '#FF7171', // Primary brand color (middle of gradient)
  accentColorForeground: 'white',
};

// Custom Lisk Sepolia chain definition
const liskSepolia: Chain = {
  id: 4202,
  name: 'Lisk Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'LSK',
    symbol: 'LSK',
  },
  rpcUrls: {
    public: { http: ['https://rpc.sepolia-api.lisk.com'] },
    default: { http: ['https://rpc.sepolia-api.lisk.com'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://sepolia-blockscout.lisk.com/' },
  },
  testnet: true,
};

// Configure chains
const chains = [mainnet, sepolia, liskSepolia] as const;

// Create wagmi config with RainbowKit v2
const config = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(mainnet.rpcUrls.default.http[0], {
      batch: true,
    }),
    [sepolia.id]: http(sepolia.rpcUrls.default.http[0], {
      batch: true,
    }),
    [liskSepolia.id]: http(liskSepolia.rpcUrls.default.http[0], {
      batch: true,
    }),
  },
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
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration issues with theme detection
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class">
          {/* {mounted && ( */}
            <RainbowKitProvider 
              appInfo={{
                appName: 'Raise3 Application',
              }}
              theme={{
                lightMode: lightTheme({
                  accentColor: '#FF7171',
                  accentColorForeground: 'white',
                  borderRadius: 'medium',
                }),
                darkMode: darkTheme({
                  accentColor: '#FF7171',
                  accentColorForeground: 'white',
                  borderRadius: 'medium',
                }),
              }}
            >
              <ContractProvider>
                {/* <WalletRedirector /> */}
                {children}
              </ContractProvider>
            </RainbowKitProvider>
          {/* )} */}
          {/* {!mounted && ( */}
            {/* <ContractProvider>
              {children}
            </ContractProvider> */}
          {/* )} */}
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}