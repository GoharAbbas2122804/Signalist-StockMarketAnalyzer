/**
 * Example usage of useAuthGuard hook
 * 
 * This example demonstrates how to protect actions that require authentication
 * and show an auth prompt to guest users.
 */

'use client';

import React from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { AuthPromptDialog } from '@/components/AuthPromptDialog';
import { Button } from '@/components/ui/button';

export const WatchlistButtonExample = () => {
  const { 
    requireAuth, 
    showAuthPrompt, 
    authPromptAction, 
    closeAuthPrompt,
    isAuthenticated,
    isGuest 
  } = useAuthGuard();

  const handleAddToWatchlist = async () => {
    // This will check if user is authenticated
    // If guest: shows auth prompt
    // If authenticated: executes the callback
    await requireAuth('add to watchlist', async () => {
      // This code only runs for authenticated users
      console.log('Adding to watchlist...');
      // await addToWatchlistAPI();
    }, { guardType: 'add' });
  };

  const handleRemoveFromWatchlist = async () => {
    await requireAuth('remove from watchlist', async () => {
      console.log('Removing from watchlist...');
      // await removeFromWatchlistAPI();
    }, { guardType: 'remove' });
  };

  return (
    <>
      <div className="flex gap-2">
        <Button 
          onClick={handleAddToWatchlist}
          variant={isGuest ? 'outline' : 'default'}
        >
          {isGuest ? '🔒 Add to Watchlist' : 'Add to Watchlist'}
        </Button>
        
        <Button 
          onClick={handleRemoveFromWatchlist}
          variant="destructive"
          disabled={isGuest}
        >
          Remove from Watchlist
        </Button>

        {isGuest && (
          <span className="text-sm text-muted-foreground">
            Sign in to manage your watchlist
          </span>
        )}
      </div>

      {/* Auth prompt dialog - automatically shown when guest tries protected action */}
      <AuthPromptDialog
        open={showAuthPrompt}
        onOpenChange={closeAuthPrompt}
        action={authPromptAction}
      />
    </>
  );
};

/**
 * Another example with custom error handling
 */
export const ProfileButtonExample = () => {
  const { 
    requireAuth, 
    showAuthPrompt, 
    authPromptAction, 
    closeAuthPrompt,
    error,
    clearError 
  } = useAuthGuard();

  const handleUpdateProfile = async () => {
    await requireAuth('update your profile', async () => {
      try {
        // Update profile logic
        console.log('Updating profile...');
        // await updateProfileAPI();
      } catch (err) {
        console.error('Failed to update profile:', err);
        // Error is automatically captured by useAuthGuard
      }
    }, { guardType: 'profile' });
  };

  return (
    <>
      <Button onClick={handleUpdateProfile}>
        Update Profile
      </Button>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
          <button onClick={clearError} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      <AuthPromptDialog
        open={showAuthPrompt}
        onOpenChange={closeAuthPrompt}
        action={authPromptAction}
      />
    </>
  );
};
