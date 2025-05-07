import { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

// This component handles redirection after wallet connection
export function WalletRedirector() {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const redirectionHandledRef = useRef(false);
  const wasConnectedRef = useRef(false);

  // This effect handles the wallet connection flow with optimized redirection
  useEffect(() => {
    // Only trigger redirection if connected and not already handled
    if (isConnected && address && !redirectionHandledRef.current) {
      // Immediately mark as handled to prevent double redirections
      redirectionHandledRef.current = true;
      wasConnectedRef.current = true;
      
      // Ignore redirection on specific pages like the role selection page
      if (pathname === '/register' || pathname === '/dashboard') {
        return;
      }

      // Check if the user has already registered and selected a role
      const userType = localStorage.getItem(`userType-${address}`);
      const userRole = localStorage.getItem(`userRole-${address}`);
      
      if (userType || userRole) {
        // Returning user - redirect straight to dashboard without showing role selection
        console.log('Returning user detected - redirecting directly to dashboard');
        
        // Make sure we record that they are registered even if only userRole exists
        if (!userType && userRole) {
          localStorage.setItem(`userType-${address}`, 'registered');
        }
        
        // Use direct browser navigation for immediate redirection
        window.location.href = '/dashboard';
      } else {
        // New user - redirect to registration page
        console.log('New user detected - redirecting to registration');
        window.location.href = '/register';
      }
    } else if (!isConnected && wasConnectedRef.current) {
      // Handle disconnection
      console.log('Wallet disconnected, reset state');
      redirectionHandledRef.current = false;
      wasConnectedRef.current = false;
      
      // Only redirect if not already on landing page
      if (pathname !== '/' && pathname !== '/landing') {
        window.location.href = '/';
      }
    }
  }, [isConnected, address, pathname]);

  // This component doesn't render anything
  return null;
}

