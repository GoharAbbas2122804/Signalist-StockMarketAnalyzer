'use client';

import { useState, useCallback } from 'react';
import { useGuestSession } from '@/lib/context/GuestSessionContext';
import { handleGuestActionAttempt, showInfoToast } from '@/lib/utils/error-handling';

type GuardAction = 'add' | 'remove' | 'modify' | 'profile' | 'settings';

interface RequireAuthOptions {
  guardType?: GuardAction;
}

interface UseAuthGuardReturn {
  isAuthenticated: boolean;
  isGuest: boolean;
  requireAuth: (action: string, callback: () => void | Promise<void>, options?: RequireAuthOptions) => Promise<void>;
  showAuthPrompt: boolean;
  authPromptAction: string;
  closeAuthPrompt: () => void;
  error: string | null;
  clearError: () => void;
}

/**
 * Custom hook for protecting actions that require authentication
 * 
 * Usage:
 * ```tsx
 * const { requireAuth, showAuthPrompt, authPromptAction, closeAuthPrompt } = useAuthGuard();
 * 
 * const handleAddToWatchlist = () => {
 *   requireAuth('add to watchlist', async () => {
 *     // This callback only runs if user is authenticated
 *     await addToWatchlist();
 *   });
 * };
 * 
 * return (
 *   <>
 *     <button onClick={handleAddToWatchlist}>Add to Watchlist</button>
 *     <AuthPromptDialog 
 *       open={showAuthPrompt} 
 *       onOpenChange={closeAuthPrompt}
 *       action={authPromptAction}
 *     />
 *   </>
 * );
 * ```
 */
export const useAuthGuard = (): UseAuthGuardReturn => {
  const { isGuest } = useGuestSession();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authPromptAction, setAuthPromptAction] = useState('');
  const [error, setError] = useState<string | null>(null);

  // User is authenticated if they are NOT a guest
  const isAuthenticated = !isGuest;

  /**
   * Checks if user is authenticated before executing callback
   * If user is a guest, shows auth prompt instead
   * 
   * @param action - Description of the action requiring auth (e.g., "add to watchlist")
   * @param callback - Function to execute if user is authenticated
   */
  const requireAuth = useCallback(async (action: string, callback: () => void | Promise<void>, options: RequireAuthOptions = {}) => {
    const guardType: GuardAction = options.guardType || 'modify';

    try {
      if (isGuest) {
        handleGuestActionAttempt(guardType);
        // User is a guest - show auth prompt and info toast
        setAuthPromptAction(action);
        setShowAuthPrompt(true);
        
        // Show friendly info message
        showInfoToast(
          `Sign in to ${action}`,
          'Create an account to unlock all features'
        );
        
        setError(null);
      } else {
        // User is authenticated - execute callback
        setError(null);
        await callback();
      }
    } catch (err) {
      console.error('Error in requireAuth:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      // Don't show toast here as the callback should handle its own errors
    }
  }, [isGuest]);

  /**
   * Closes the auth prompt dialog
   */
  const closeAuthPrompt = useCallback(() => {
    setShowAuthPrompt(false);
    setAuthPromptAction('');
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isAuthenticated,
    isGuest,
    requireAuth,
    showAuthPrompt,
    authPromptAction,
    closeAuthPrompt,
    error,
    clearError,
  };
};
