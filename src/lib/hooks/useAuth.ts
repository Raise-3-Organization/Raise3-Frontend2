import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as authApi from '../api/auth';
import { User } from '../api/types';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get current user info
  const { 
    data: user, 
    isLoading: isLoadingUser, 
    error: userError, 
    refetch: refetchUser 
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getCurrentUser,
    retry: 1,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Initialize - check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setIsInitialized(true);
        return;
      }
      
      try {
        await refetchUser();
      } catch (error) {
        // Token may be invalid, clear it
        localStorage.removeItem('auth_token');
      } finally {
        setIsInitialized(true);
      }
    };
    
    checkAuth();
  }, [refetchUser]);
  
  // Connect wallet mutation
  const { 
    mutateAsync: connectWallet,
    isPending: isConnecting
  } = useMutation({
    mutationFn: (walletAddress: string) => authApi.connectWallet(walletAddress),
  });
  
  // Verify signature mutation
  const { 
    mutateAsync: verifySignature,
    isPending: isVerifying
  } = useMutation({
    mutationFn: ({ walletAddress, signature }: { walletAddress: string; signature: string }) => 
      authApi.verifySignature(walletAddress, signature),
    onSuccess: (data) => {
      // Update the user data in the cache
      queryClient.setQueryData(['auth', 'me'], data.user);
    },
  });
  
  // Logout mutation
  const { 
    mutateAsync: logout,
    isPending: isLoggingOut
  } = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear the user data from the cache
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      
      // Redirect to home page after logout
      router.push('/');
    },
  });
  
  // Convenience function for full login flow
  const login = useCallback(async (walletAddress: string, signMessage: (message: string) => Promise<string>) => {
    // 1. Connect wallet to get nonce
    const { nonce } = await connectWallet(walletAddress);
    
    // 2. Sign the nonce
    const signature = await signMessage(nonce);
    
    // 3. Verify the signature
    return verifySignature({ walletAddress, signature });
  }, [connectWallet, verifySignature]);
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading: isLoadingUser || !isInitialized,
    isConnecting,
    isVerifying,
    isLoggingOut,
    error: userError,
    login,
    logout,
    connectWallet,
    verifySignature,
  };
}; 