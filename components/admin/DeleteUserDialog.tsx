'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DeleteUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: { email: string; name?: string } | null;
    onConfirm: () => void;
    loading: boolean;
}

export default function DeleteUserDialog({
    open,
    onOpenChange,
    user,
    onConfirm,
    loading
}: DeleteUserDialogProps) {
    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <DialogTitle>Delete User</DialogTitle>
                    </div>
                    <DialogDescription>
                        Are you sure you want to delete this user? This action will soft-delete the user
                        and they will no longer be able to access the application.
                    </DialogDescription>
                </DialogHeader>

                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <p className="text-sm">
                        <strong>Email:</strong> {user.email}
                    </p>
                    {user.name && (
                        <p className="text-sm mt-1">
                            <strong>Name:</strong> {user.name}
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete User'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
