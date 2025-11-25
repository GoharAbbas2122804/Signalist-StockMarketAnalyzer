'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Wallet, ListChecks, Activity, User, ArrowRight, TrendingUp } from 'lucide-react'
import DashboardMetricCard from '@/components/DashboardMetricCard'
import { Button } from '@/components/ui/button'

// Lazy load heavy chart components
const PortfolioChart = dynamic(() => import('@/components/PortfolioChart'), {
  loading: () => <div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-xl" />,
  ssr: false // Charts are client-side only usually
})
const AssetAllocationChart = dynamic(() => import('@/components/AssetAllocationChart'), {
  loading: () => <div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-xl" />,
  ssr: false
})

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/dashboard-metrics')
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error('Failed to fetch dashboard metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Skeleton loader */}
          <div className="h-12 w-64 bg-gray-800/60 rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-800/60 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-800/60 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] py-8 px-4 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">
            Welcome back, {metrics?.userName || 'User'}
          </h1>
          <p className="text-gray-400 text-lg">
            Here's your portfolio overview and recent activity
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardMetricCard
            icon={ListChecks}
            title="Watchlist Items"
            value={metrics?.watchlistCount || 0}
            subtitle="Stocks you're tracking"
          />
          <DashboardMetricCard
            icon={Wallet}
            title="Portfolio Value"
            value={metrics?.portfolioValue || '$0.00'}
            trend={{ value: 12.5, isPositive: true }}
            subtitle="Total portfolio worth"
          />
          <DashboardMetricCard
            icon={Activity}
            title="Recent Activity"
            value={metrics?.recentActivityCount || 0}
            subtitle="Actions this week"
          />
          <DashboardMetricCard
            icon={User}
            title="Account Status"
            value={metrics?.accountAge || 'New'}
            subtitle="Member since"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PortfolioChart />
          <AssetAllocationChart />
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
                Ready to explore the market?
              </h3>
              <p className="text-gray-400">
                Browse real-time market data, add stocks to your watchlist, and stay ahead.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/watchlist">
                <Button
                  variant="outline"
                  className="border-gray-600 hover:border-yellow-500/50 hover:bg-yellow-500/10 text-gray-200"
                >
                  View Watchlist
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/stocks">
                <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-gray-900 font-semibold shadow-lg hover:shadow-yellow-500/20">
                  Explore Stocks
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}