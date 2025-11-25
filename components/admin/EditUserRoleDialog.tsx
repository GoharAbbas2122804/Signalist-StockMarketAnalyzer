'use client';

import { useState } from 'react';
import { UserRole } from '@/Database/models/user.model';
import { getRoleDisplayName } from '@/lib/utils/rbac';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface EditUserRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: { email: string; name?: string; role: UserRole } | null;
    onSave: (newRole: UserRole) => void;
    loading: boolean;
}

export default function EditUserRoleDialog({
    open,
    onOpenChange,
    user,
    onSave,
    loading
}: EditUserRoleDialogProps) {
    const [selectedRole, setSelectedRole] = useState<UserRole | undefined>(user?.role);

    // Update selected role when user changes
    if (user && selectedRole !== user.role && !loading) {
        setSelectedRole(user.role);
    }

    if (!user) return null;

    const handleSave = () => {
        if (selectedRole) {
            onSave(selectedRole);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change User Role</DialogTitle>
                    <DialogDescription>
                        Update the role for this user. This will affect their access permissions.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>User</Label>
                        <div className="rounded-lg border p-3 bg-muted">
                            <p className="font-medium">{user.email}</p>
                            {user.name && (
                                <p className="text-sm text-muted-foreground">{user.name}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={selectedRole}
                            onValueChange={(value) => setSelectedRole(value as UserRole)}
                        >
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={UserRole.GUEST}>
                                    {getRoleDisplayName(UserRole.GUEST)}
                                </SelectItem>
                                <SelectItem value={UserRole.USER}>
                                    {getRoleDisplayName(UserRole.USER)}
                                </SelectItem>
                                <SelectItem value={UserRole.ADMIN}>
                                    {getRoleDisplayName(UserRole.ADMIN)}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
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
                        onClick={handleSave}
                        disabled={loading || !selectedRole || selectedRole === user.role}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
