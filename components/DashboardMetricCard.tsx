'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function DashboardMetricCard({
    icon: Icon,
    title,
    value,
    trend,
    subtitle
}: MetricCardProps) {
    return (
        <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm hover:border-yellow-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400/10 to-yellow-500/10 border border-yellow-500/20">
                            <Icon className="w-5 h-5 text-yellow-400" />
                        </div>
                        <CardTitle className="text-sm font-medium text-gray-400">
                            {title}
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-bold text-gray-100 tracking-tight">
                            {value}
                        </p>
                        {trend && (
                            <div className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                {trend.isPositive ? (
                                    <TrendingUp className="w-4 h-4" />
                                ) : (
                                    <TrendingDown className="w-4 h-4" />
                                )}
                                <span>{Math.abs(trend.value)}%</span>
                            </div>
                        )}
                    </div>
                    {subtitle && (
                        <CardDescription className="text-gray-500 text-sm">
                            {subtitle}
                        </CardDescription>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
