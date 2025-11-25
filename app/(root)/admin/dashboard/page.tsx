import Link from 'next/link';
import { getDashboardMetrics } from '@/lib/actions/admin.actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Shield, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserGrowthChart from '@/components/admin/UserGrowthChart';
import RoleDistributionChart from '@/components/admin/RoleDistributionChart';
import DashboardUsersTable from '@/components/admin/DashboardUsersTable';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    const metrics = await getDashboardMetrics();

    const metricCards = [
        {
            title: 'Total Users',
            value: metrics.totalUsers,
            description: 'All registered users',
            icon: Users,
            trend: `+${metrics.newUsers7Days} this week`
        },
        {
            title: 'Active Users',
            value: metrics.activeUsers,
            description: 'Active in last 30 days',
            icon: Activity,
            trend: `${Math.round((metrics.activeUsers / metrics.totalUsers) * 100)}% of total`
        },
        {
            title: 'New Sign-ups',
            value: metrics.newUsers30Days,
            description: 'Last 30 days',
            icon: UserPlus,
            trend: `${metrics.newUsers7Days} this week`
        },
        {
            title: 'Admins',
            value: metrics.adminCount,
            description: 'Admin accounts',
            icon: Shield,
            trend: `${metrics.userCount} regular users`
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Overview of your application metrics
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/admin/users">Manage Users</Link>
                    </Button>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metricCards.map((metric) => {
                    const Icon = metric.icon;
                    return (
                        <Card key={metric.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {metric.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metric.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {metric.description}
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                                    {metric.trend}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                        <CardDescription>New user signups over the last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UserGrowthChart data={metrics.userGrowth} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Role Distribution</CardTitle>
                        <CardDescription>Users by role type</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RoleDistributionChart data={metrics.roleDistribution} />
                    </CardContent>
                </Card>
            </div>

            {/* Recent Users Table */}
            <DashboardUsersTable />

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/admin/users">View All Users</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/admin/audit-logs">View Audit Logs</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
