'use client';

import { useState } from 'react';
import { UserRole } from '@/lib/types/user';
import { updateUserRole, deleteUser, restoreUser } from '@/lib/actions/admin.actions';
import { getRoleBadgeVariant, getRoleDisplayName } from '@/lib/utils/rbac';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Trash2, Shield, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import DeleteUserDialog from './DeleteUserDialog';
import EditUserRoleDialog from './EditUserRoleDialog';

interface User {
    _id: string;
    id: string;
    email: string;
    name?: string;
    role: UserRole;
    createdAt: string | Date;
    deletedAt?: string | Date | null;
    lastLoginAt?: string | Date;
}

interface UserManagementTableProps {
    users: User[];
    onRefresh: () => void;
}

export default function UserManagementTable({ users = [], onRefresh }: UserManagementTableProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        setLoading(true);
        try {
            await deleteUser(selectedUser.id);
            toast.success('User deleted successfully');
            setDeleteDialogOpen(false);
            onRefresh();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete user');
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreUser = async (userId: string) => {
        setLoading(true);
        try {
            await restoreUser(userId);
            toast.success('User restored successfully');
            onRefresh();
        } catch (error: any) {
            toast.error(error.message || 'Failed to restore user');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (newRole: UserRole) => {
        if (!selectedUser) return;

        setLoading(true);
        try {
            await updateUserRole(selectedUser.id, newRole);
            toast.success('User role updated successfully');
            setRoleDialogOpen(false);
            onRefresh();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update user role');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: string | Date | undefined) => {
        if (!date) return 'Never';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const truncateId = (id: string) => {
        return id.length > 8 ? `${id.substring(0, 8)}...` : id;
    };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center text-muted-foreground">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-mono text-xs">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="cursor-help">{truncateId(user.id)}</span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="font-mono text-xs">{user.id}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell className="font-medium">{user.email}</TableCell>
                                    <TableCell>{user.name || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={getRoleBadgeVariant(user.role)}>
                                            {getRoleDisplayName(user.role)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {formatDate(user.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {formatDate(user.lastLoginAt)}
                                    </TableCell>
                                    <TableCell>
                                        {user.deletedAt ? (
                                            <Badge variant="secondary">Deleted</Badge>
                                        ) : (
                                            <Badge variant="default" className="bg-green-600">Active</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            {!user.deletedAt ? (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setRoleDialogOpen(true);
                                                        }}
                                                        disabled={loading}
                                                        className="h-8"
                                                    >
                                                        <Shield className="mr-1.5 h-3.5 w-3.5" />
                                                        Change Role
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setDeleteDialogOpen(true);
                                                        }}
                                                        disabled={loading}
                                                        className="h-8"
                                                    >
                                                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                                        Delete
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleRestoreUser(user.id)}
                                                    disabled={loading}
                                                    className="h-8"
                                                >
                                                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                                                    Restore
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <DeleteUserDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                user={selectedUser}
                onConfirm={handleDeleteUser}
                loading={loading}
            />

            <EditUserRoleDialog
                open={roleDialogOpen}
                onOpenChange={setRoleDialogOpen}
                user={selectedUser}
                onSave={handleUpdateRole}
                loading={loading}
            />
        </>
    );
}
