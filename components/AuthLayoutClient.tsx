'use client';

import { useEffect } from 'react';
import { useGuestSession } from '@/lib/context/GuestSessionContext';

/**
 * Client component to clear guest session when accessing auth pages
 * This ensures a clean state for authentication flows
 */
export const AuthLayoutClient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isGuest, exitGuestMode } = useGuestSession();

  useEffect(() => {
    // Clear guest session when accessing auth pages
    if (isGuest) {
      exitGuestMode();
    }
  }, [isGuest, exitGuestMode]);

  return <>{children}</>;
};
