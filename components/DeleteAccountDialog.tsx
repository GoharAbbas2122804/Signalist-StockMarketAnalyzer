'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle } from 'lucide-react';

interface DeleteAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userEmail: string;
    onConfirmDelete: () => Promise<void>;
}

export const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
    open,
    onOpenChange,
    userEmail,
    onConfirmDelete,
}) => {
    const [confirmEmail, setConfirmEmail] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onConfirmDelete();
            setConfirmEmail('');
            onOpenChange(false);
        } catch (error) {
            console.error('Delete failed:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClose = () => {
        setConfirmEmail('');
        onOpenChange(false);
    };

    const isEmailMatch = confirmEmail === userEmail;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="w-5 h-5" />
                        Delete Account
                    </DialogTitle>
                    <DialogDescription className="space-y-2 pt-2">
                        <p className="font-semibold text-gray-200">
                            This action is permanent and cannot be undone.
                        </p>
                        <p className="text-gray-400">
                            Deleting your account will:
                        </p>
                        <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
                            <li>Remove all your personal information</li>
                            <li>Delete your watchlist and preferences</li>
                            <li>Permanently erase all your data</li>
                        </ul>
                        <p className="text-gray-300 pt-2">
                            To confirm, please type your email address:{' '}
                            <span className="font-mono font-semibold">{userEmail}</span>
                        </p>
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <Input
                        type="email"
                        placeholder="Enter your email to confirm"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        className="w-full"
                        disabled={isDeleting}
                    />
                </div>

                <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="w-full sm:w-auto sm:flex-1"
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={!isEmailMatch || isDeleting}
                        className="w-full sm:w-auto sm:flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
