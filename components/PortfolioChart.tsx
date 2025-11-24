'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const DUMMY_DATA: PortfolioDataPoint[] = [
    { date: 'Jun', value: 98500 },
    { date: 'Jul', value: 105200 },
    { date: 'Aug', value: 102800 },
    { date: 'Sep', value: 112400 },
    { date: 'Oct', value: 118900 },
    { date: 'Nov', value: 125432 },
]

export default function PortfolioChart() {
    return (
        <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-100">
                    Portfolio Performance
                </CardTitle>
                <p className="text-sm text-gray-500">Last 6 months growth trend</p>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={DUMMY_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                        <XAxis
                            dataKey="date"
                            stroke="#9CA3AF"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            style={{ fontSize: '12px' }}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#F3F4F6'
                            }}
                            labelStyle={{ color: '#9CA3AF' }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#FBBF24"
                            strokeWidth={3}
                            dot={{ fill: '#FBBF24', r: 4 }}
                            activeDot={{ r: 6, fill: '#FCD34D' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
