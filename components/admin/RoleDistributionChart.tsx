'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RoleDistribution {
    admin: number;
    user: number;
    guest: number;
}

interface RoleDistributionChartProps {
    data: RoleDistribution;
}

const COLORS = {
    admin: 'hsl(var(--destructive))',
    user: 'hsl(var(--primary))',
    guest: 'hsl(var(--muted-foreground))'
};

const ROLE_LABELS = {
    admin: 'Admins',
    user: 'Users',
    guest: 'Guests'
};

export default function RoleDistributionChart({ data }: RoleDistributionChartProps) {
    const chartData = [
        { name: ROLE_LABELS.admin, value: data.admin, color: COLORS.admin },
        { name: ROLE_LABELS.user, value: data.user, color: COLORS.user },
        { name: ROLE_LABELS.guest, value: data.guest, color: COLORS.guest }
    ].filter(item => item.value > 0);

    if (chartData.length === 0) {
        return (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => {
                        const { name, percent } = props;
                        return name && percent !== undefined ? `${name}: ${(percent * 100).toFixed(0)}%` : '';
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                    }}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
