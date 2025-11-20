'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, TrendingDown, Info, RefreshCw } from 'lucide-react'
import { useGuestSession } from '@/lib/context/GuestSessionContext'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { AuthPromptDialog } from '@/components/AuthPromptDialog'
import WatchlistButton from '@/components/watchListButton'
import SearchCommand from '@/components/SearchCommand'
import { searchStocks } from '@/lib/actions/finnhub.actions'
import { showErrorToast } from '@/lib/utils/error-handling'
import { formatPrice } from '@/lib/utils'

const DEMO_WATCHLIST: WatchlistEntry[] = [
  {
    symbol: 'AAPL',
    company: 'Apple Inc.',
    currentPrice: 178.25,
    changePercent: 2.34,
    isInWatchlist: true,
  },
  {
    symbol: 'MSFT',
    company: 'Microsoft Corporation',
    currentPrice: 378.91,
    changePercent: -0.87,
    isInWatchlist: true,
  },
  {
    symbol: 'GOOGL',
    company: 'Alphabet Inc.',
    currentPrice: 141.8,
    changePercent: 1.52,
    isInWatchlist: true,
  },
]

const WatchlistPage = () => {
  const router = useRouter()
  const { isGuest } = useGuestSession()
  const { requireAuth, showAuthPrompt, authPromptAction, closeAuthPrompt } = useAuthGuard()

  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [initialStocks, setInitialStocks] = useState<StockWithWatchlistStatus[]>([])

  const loadWatchlist = useCallback(async () => {
    if (isGuest) {
      setWatchlist(DEMO_WATCHLIST)
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/watchlist', { cache: 'no-store' })
      const payload = await response.json().catch(() => ({ data: [] }))

      if (!response.ok) {
        throw new Error(payload?.message || 'Failed to load watchlist')
      }

      setWatchlist(Array.isArray(payload?.data) ? payload.data : [])
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load watchlist'
      setError(message)
      showErrorToast('Unable to load watchlist', message)
    } finally {
      setLoading(false)
    }
  }, [isGuest])

  useEffect(() => {
    loadWatchlist()
  }, [loadWatchlist])

  // Fetch initial stocks for search dialog
  useEffect(() => {
    const fetchInitialStocks = async () => {
      try {
        const stocks = await searchStocks();
        setInitialStocks(stocks);
      } catch (error) {
        console.error('Failed to fetch initial stocks:', error);
        setInitialStocks([]);
      }
    };
    fetchInitialStocks();
  }, []);

  const handleWatchlistChange = useCallback(
    (symbol: string, isAdded: boolean, meta?: { company?: string }) => {
      if (isGuest) return

      setWatchlist((prev) => {
        if (isAdded) {
          if (prev.some((item) => item.symbol === symbol)) {
            return prev
          }
          return [
            {
              symbol,
              company: meta?.company || symbol,
              currentPrice: null,
              changePercent: null,
              isInWatchlist: true,
            },
            ...prev,
          ]
        }

        return prev.filter((item) => item.symbol !== symbol)
      })
    },
    [isGuest]
  )

  const handleAddStock = () => {
    requireAuth(
      'add stocks to your watchlist',
      () => setSearchOpen(true),
      { guardType: 'add' }
    )
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadWatchlist()
    setRefreshing(false)
  }

  const watchlistRows = useMemo(() => watchlist, [watchlist])

  const renderChange = (changePercent: number | null) => {
    if (typeof changePercent !== 'number') {
      return <span className="text-gray-500">--</span>
    }

    const isPositive = changePercent >= 0
    const Icon = isPositive ? TrendingUp : TrendingDown

    return (
      <span className={`flex items-center justify-end gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        <Icon className="w-4 h-4" />
        <span className="font-medium">
          {isPositive ? '+' : ''}
          {changePercent.toFixed(2)}%
        </span>
      </span>
    )
  }

  return (
    <div className="min-h-[60vh] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-100">My Watchlist</h1>
              <p className="text-gray-500 text-sm md:text-base">
                Monitor your favorite stocks and stay ahead of the market.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading || refreshing || isGuest}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-sm text-gray-300 hover:border-yellow-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleAddStock}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-gray-900 font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Add Stock
              </button>
            </div>
          </div>

          {isGuest && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-blue-400 font-semibold mb-1">
                    Sign in to create your watchlist
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    You&apos;re viewing a demo watchlist. Create an account to save your favorite stocks and track them in real-time.
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href="/sign-in"
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/sign-up"
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium rounded-lg transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" aria-live="polite">
              {error}
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-16 w-full animate-pulse rounded-lg bg-gray-800/60 border border-gray-700/60" />
            ))}
          </div>
        ) : watchlistRows.length > 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700 text-xs uppercase tracking-wide text-gray-500">
                    <th className="py-4 px-6 text-left">Symbol</th>
                    <th className="py-4 px-6 text-left">Company</th>
                    <th className="py-4 px-6 text-right">Price</th>
                    <th className="py-4 px-6 text-right">Change</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {watchlistRows.map((stock) => (
                    <tr key={stock.symbol} className="border-b border-gray-700/40 hover:bg-gray-700/30 transition-colors">
                      <td className="py-4 px-6 font-semibold text-yellow-400">
                        <Link href={`/stocks/${stock.symbol}`} className="hover:text-yellow-200">
                          {stock.symbol}
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-gray-300">{stock.company}</td>
                      <td className="py-4 px-6 text-right text-gray-100 font-medium">
                        {typeof stock.currentPrice === 'number' ? formatPrice(stock.currentPrice) : '--'}
                      </td>
                      <td className="py-4 px-6 text-right">{renderChange(stock.changePercent ?? null)}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <WatchlistButton
                            symbol={stock.symbol}
                            company={stock.company}
                            isInWatchlist={stock.isInWatchlist}
                            type="icon"
                            onWatchlistChange={handleWatchlistChange}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-lg mb-4">Your watchlist is empty</p>
            <button
              onClick={handleAddStock}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-gray-900 font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Add Your First Stock
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Track your favorite stocks and monitor their performance in real-time.</p>
        </div>
      </div>

      <AuthPromptDialog
        open={showAuthPrompt}
        onOpenChange={closeAuthPrompt}
        action={authPromptAction}
      />

      <SearchCommand
        initialStocks={initialStocks}
        open={searchOpen}
        setOpen={setSearchOpen}
      />
    </div>
  )
}

export default WatchlistPage

