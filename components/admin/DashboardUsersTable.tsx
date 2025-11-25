'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserManagementTable from '@/components/admin/UserManagementTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, RefreshCcw } from 'lucide-react';

export default function DashboardUsersTable() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            console.log('Fetching users...');
            const params = new URLSearchParams({
                page: '1',
                limit: '5',
                sort: 'createdAt:desc'
            });

            const response = await fetch(`/api/admin/users?${params}`);
            if (!response.ok) {
                console.error('Fetch failed:', response.status, response.statusText);
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            console.log('Users data received:', data);
            setUsers(data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('DashboardUsersTable mounted');
        fetchUsers();
    }, []);

    return (
        <Card className="col-span-2 border-2 border-blue-500 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/20">
                <div>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>
                        Manage latest user registrations and accounts
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={fetchUsers}
                        disabled={loading}
                    >
                        <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/users">
                            View All <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {loading && users.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                        <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="p-4">
                        <UserManagementTable users={users} onRefresh={fetchUsers} />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
