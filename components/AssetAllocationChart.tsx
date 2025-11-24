'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const DUMMY_DATA: AssetAllocation[] = [
    { sector: 'Technology', percentage: 40, value: 50173, color: '#FBBF24' },
    { sector: 'Finance', percentage: 30, value: 37630, color: '#60A5FA' },
    { sector: 'Healthcare', percentage: 20, value: 25086, color: '#34D399' },
    { sector: 'Other', percentage: 10, value: 12543, color: '#A78BFA' },
]

export default function AssetAllocationChart() {
    return (
        <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-100">
                    Asset Allocation
                </CardTitle>
                <p className="text-sm text-gray-500">Portfolio distribution by sector</p>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={DUMMY_DATA}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry: any) => `${entry.sector} ${entry.percentage}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="percentage"
                        >
                            {DUMMY_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#F3F4F6'
                            }}
                            formatter={(value: number, name: string, entry: any) => [
                                `${value}% ($${entry.payload.value.toLocaleString()})`,
                                entry.payload.sector
                            ]}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value, entry: any) => (
                                <span style={{ color: '#9CA3AF', fontSize: '12px' }}>
                                    {entry.payload.sector}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
