"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter, usePathname } from "next/navigation";
import Registration from "./Registration";

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper = ({ children }: AppWrapperProps) => {
  const { isConnected, address } = useAccount();
  const [showRegistration, setShowRegistration] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // On each route change, check if user is connected and registered
  useEffect(() => {
    if (isConnected) {
      const isRegistered = localStorage.getItem(`user-registered-${address}`);
      
      // If on login page and already registered, redirect to dashboard
      if (pathname === "/login" && isRegistered) {
        router.push("/dashboard");
        return;
      }
      
      // If not registered and not already on login page, show registration
      if (!isRegistered && pathname !== "/login") {
        // Check if we're already showing registration or if we're on a specific page that doesn't need it
        if (!showRegistration && pathname !== "/" && !pathname.startsWith("/#")) {
          setShowRegistration(true);
        }
      }
    } else {
      // If not connected and trying to access dashboard, redirect to login
      if (pathname === "/dashboard") {
        router.push("/login");
      }
    }
  }, [isConnected, pathname, router, address, showRegistration]);

  // Handle registration completion
  const handleRegistrationComplete = () => {
    setShowRegistration(false);
    
    // If on home page, stay there, otherwise go to dashboard
    if (pathname !== "/") {
      router.push("/dashboard");
    }
  };

  return (
    <>
      {showRegistration && isConnected && (
        <Registration onComplete={handleRegistrationComplete} />
      )}
      {children}
    </>
  );
};

export default AppWrapper; 