"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { User } from '@/lib/api/types';

interface AuthContextValue {
  user: User | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  isConnecting: boolean;
  isVerifying: boolean;
  isLoggingOut: boolean;
  error: unknown;
  login: (walletAddress: string, signMessage: (message: string) => Promise<string>) => Promise<any>;
  logout: () => Promise<void>;
  connectWallet: (walletAddress: string) => Promise<any>;
  verifySignature: (params: { walletAddress: string; signature: string }) => Promise<any>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
} 