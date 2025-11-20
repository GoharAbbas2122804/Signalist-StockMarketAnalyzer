'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AuthPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action?: string;
  title?: string;
  description?: string;
}

export const AuthPromptDialog: React.FC<AuthPromptDialogProps> = ({
  open,
  onOpenChange,
  action = 'access this feature',
  title,
  description,
}) => {
  const router = useRouter();

  const handleSignIn = () => {
    onOpenChange(false);
    router.push('/sign-in');
  };

  const handleSignUp = () => {
    onOpenChange(false);
    router.push('/sign-up');
  };

  const defaultTitle = 'Sign in required';
  const defaultDescription = `Sign in to ${action}. Create an account to save your preferences and access all features.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title || defaultTitle}</DialogTitle>
          <DialogDescription>
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-2">
          <Button
            variant="outline"
            onClick={handleSignIn}
            className="w-full sm:w-auto sm:flex-1"
          >
            Log In
          </Button>
          <Button
            onClick={handleSignUp}
            className="w-full sm:w-auto sm:flex-1"
          >
            Sign Up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
