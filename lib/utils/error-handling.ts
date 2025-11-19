/**
 * Error handling utilities for guest mode and authentication
 */

import { toast } from 'sonner';

/**
 * Error messages for different scenarios
 */
export const ErrorMessages = {
  // Authentication errors
  AUTH_REQUIRED: 'Please sign in to access this feature',
  AUTH_FAILED: 'Authentication failed. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  
  // Guest mode restrictions
  GUEST_WATCHLIST_ADD: 'Sign in to add stocks to your watchlist',
  GUEST_WATCHLIST_REMOVE: 'Sign in to remove stocks from your watchlist',
  GUEST_WATCHLIST_MODIFY: 'Sign in to modify your watchlist',
  GUEST_PROFILE_ACCESS: 'Sign in to access your profile',
  GUEST_SETTINGS_ACCESS: 'Sign in to access settings',
  
  // Generic errors
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
} as const;

/**
 * Success messages for different actions
 */
export const SuccessMessages = {
  GUEST_MODE_ENTERED: 'Exploring as guest',
  GUEST_MODE_EXITED: 'Guest mode ended',
  AUTH_SUCCESS: 'Successfully signed in',
  LOGOUT_SUCCESS: 'Successfully signed out',
} as const;

/**
 * Show error toast notification
 */
export const showErrorToast = (message: string, description?: string) => {
  toast.error(message, {
    description,
    duration: 4000,
  });
};

/**
 * Show success toast notification
 */
export const showSuccessToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
    duration: 3000,
  });
};

/**
 * Show info toast notification
 */
export const showInfoToast = (message: string, description?: string) => {
  toast.info(message, {
    description,
    duration: 3000,
  });
};

/**
 * Show warning toast notification
 */
export const showWarningToast = (message: string, description?: string) => {
  toast.warning(message, {
    description,
    duration: 3500,
  });
};

/**
 * Handle guest action attempt with appropriate error message
 */
export const handleGuestActionAttempt = (action: 'add' | 'remove' | 'modify' | 'profile' | 'settings') => {
  const messages = {
    add: ErrorMessages.GUEST_WATCHLIST_ADD,
    remove: ErrorMessages.GUEST_WATCHLIST_REMOVE,
    modify: ErrorMessages.GUEST_WATCHLIST_MODIFY,
    profile: ErrorMessages.GUEST_PROFILE_ACCESS,
    settings: ErrorMessages.GUEST_SETTINGS_ACCESS,
  };

  showInfoToast(messages[action], 'Create an account to unlock all features');
};

/**
 * Handle session expiration
 */
export const handleSessionExpiration = () => {
  showWarningToast(
    ErrorMessages.SESSION_EXPIRED,
    'Please sign in again to continue'
  );
};

/**
 * Handle authentication failure
 */
export const handleAuthFailure = (error?: string) => {
  showErrorToast(
    ErrorMessages.AUTH_FAILED,
    error || 'Please check your credentials and try again'
  );
};

/**
 * Handle network errors
 */
export const handleNetworkError = () => {
  showErrorToast(
    ErrorMessages.NETWORK_ERROR,
    'Please check your internet connection'
  );
};

/**
 * Parse and handle API errors
 */
export const handleApiError = (error: unknown) => {
  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      handleSessionExpiration();
      return;
    }
    
    if (error.message.includes('network') || error.message.includes('fetch')) {
      handleNetworkError();
      return;
    }
    
    // Generic error with message
    showErrorToast('Error', error.message);
  } else {
    // Unknown error
    showErrorToast(ErrorMessages.UNKNOWN_ERROR);
  }
};
