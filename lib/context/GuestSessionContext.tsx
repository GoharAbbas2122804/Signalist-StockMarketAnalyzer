'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  setGuestSession,
  clearGuestSession,
  isGuestSession as checkIsGuestSession,
} from '@/lib/utils/guest-session';
import { showSuccessToast, showErrorToast } from '@/lib/utils/error-handling';

type GuestModeOptions = {
  silent?: boolean;
};

interface GuestSessionContextType {
  isGuest: boolean;
  enterGuestMode: (options?: GuestModeOptions) => void;
  exitGuestMode: () => void;
  error: string | null;
  clearError: () => void;
}

const GuestSessionContext = createContext<GuestSessionContextType | undefined>(undefined);
const GUEST_COOKIE_NAME = 'signalist_guest_session';

interface GuestSessionProviderProps {
  children: React.ReactNode;
}

export const GuestSessionProvider: React.FC<GuestSessionProviderProps> = ({ children }) => {
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize guest state from sessionStorage on mount
  useEffect(() => {
    try {
      const guestStatus = checkIsGuestSession();
      setIsGuest(guestStatus);
    } catch (err) {
      console.error('Error checking guest session:', err);
      setError('Failed to load session state');
      showErrorToast('Session Error', 'Failed to load your session. Please refresh the page.');
    }
  }, []);

  // Listen for sessionStorage changes triggered in other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'signalist_guest_session') {
        setIsGuest(checkIsGuestSession());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Enter guest mode
  const enterGuestMode = useCallback((options?: GuestModeOptions) => {
    try {
      setGuestSession();
      setIsGuest(true);
      // Set cookie for server-side detection
      document.cookie = `${GUEST_COOKIE_NAME}=true; path=/; max-age=86400; samesite=lax`;
      if (!options?.silent) {
        showSuccessToast('Exploring as guest', 'Sign up to save your preferences');
      }
      setError(null);
    } catch (err) {
      console.error('Error entering guest mode:', err);
      setError('Failed to enter guest mode');
      showErrorToast('Error', 'Failed to enter guest mode. Please try again.');
    }
  }, []);

  // Exit guest mode
  const exitGuestMode = useCallback(() => {
    try {
      clearGuestSession();
      setIsGuest(false);
      // Clear cookie
      document.cookie = `${GUEST_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;
      setError(null);
    } catch (err) {
      console.error('Error exiting guest mode:', err);
      setError('Failed to exit guest mode');
      showErrorToast('Error', 'Failed to exit guest mode. Please try again.');
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    isGuest,
    enterGuestMode,
    exitGuestMode,
    error,
    clearError,
  };

  return (
    <GuestSessionContext.Provider value={value}>
      {children}
    </GuestSessionContext.Provider>
  );
};

/**
 * Custom hook for accessing guest session state
 * Must be used within GuestSessionProvider
 */
export const useGuestSession = (): GuestSessionContextType => {
  const context = useContext(GuestSessionContext);
  
  if (context === undefined) {
    throw new Error('useGuestSession must be used within a GuestSessionProvider');
  }
  
  return context;
};
