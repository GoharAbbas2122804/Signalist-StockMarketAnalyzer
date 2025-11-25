'use client';

import { useState, useEffect } from 'react';
import { AuditAction } from '@/Database/models/auditLog.model';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RefreshCcw, Shield, Trash2, RotateCcw, UserPlus, Edit } from 'lucide-react';

const actionIcons: Record<AuditAction, React.ComponentType<{ className?: string }>> = {
    [AuditAction.USER_DELETE]: Trash2,
    [AuditAction.USER_RESTORE]: RotateCcw,
    [AuditAction.ROLE_CHANGE]: Shield,
    [AuditAction.USER_UPDATE]: Edit,
    [AuditAction.USER_CREATE]: UserPlus,
    [AuditAction.ADMIN_LOGIN]: Shield
};

const actionLabels: Record<AuditAction, string> = {
    [AuditAction.USER_DELETE]: 'User Deleted',
    [AuditAction.USER_RESTORE]: 'User Restored',
    [AuditAction.ROLE_CHANGE]: 'Role Changed',
    [AuditAction.USER_UPDATE]: 'User Updated',
    [AuditAction.USER_CREATE]: 'User Created',
    [AuditAction.ADMIN_LOGIN]: 'Admin Login'
};

export default function AdminAuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionFilter, setActionFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                ...(actionFilter !== 'all' && { action: actionFilter })
            });

            const response = await fetch(`/api/admin/audit-logs?${params}`);
            if (!response.ok) throw new Error('Failed to fetch audit logs');

            const data = await response.json();
            setLogs(data.logs);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page, actionFilter]);

    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatMetadata = (metadata: any) => {
        if (!metadata || Object.keys(metadata).length === 0) return '-';
        return Object.entries(metadata)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                <p className="text-muted-foreground mt-1">
                    Track all administrative actions and changes
                </p>
            </div>

            {/* Filters Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                    <CardDescription>Filter audit logs by action type</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Select value={actionFilter} onValueChange={setActionFilter}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Filter by action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Actions</SelectItem>
                                <SelectItem value={AuditAction.USER_DELETE}>User Deleted</SelectItem>
                                <SelectItem value={AuditAction.USER_RESTORE}>User Restored</SelectItem>
                                <SelectItem value={AuditAction.ROLE_CHANGE}>Role Changed</SelectItem>
                                <SelectItem value={AuditAction.USER_UPDATE}>User Updated</SelectItem>
                                <SelectItem value={AuditAction.USER_CREATE}>User Created</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            onClick={fetchLogs}
                            disabled={loading}
                        >
                            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Audit Logs Table Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                    <CardDescription>
                        Showing page {page} of {totalPages}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Action</TableHead>
                                            <TableHead>Admin</TableHead>
                                            <TableHead>Target User</TableHead>
                                            <TableHead>Details</TableHead>
                                            <TableHead>Timestamp</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logs.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                                    No audit logs found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            logs.map((log) => {
                                                const Icon = actionIcons[log.action as AuditAction];
                                                return (
                                                    <TableRow key={log.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                                                                <Badge variant="outline">
                                                                    {actionLabels[log.action as AuditAction] || log.action}
                                                                </Badge>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {log.adminEmail}
                                                        </TableCell>
                                                        <TableCell>
                                                            {log.targetUserEmail || '-'}
                                                        </TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {formatMetadata(log.metadata)}
                                                        </TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {formatDate(log.createdAt)}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        Page {page} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
