"use client"

import { useEffect, useState } from "react"
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { useDebounce } from "@/hooks/useDebounce";
import WatchlistButton from "@/components/watchListButton";

export default function SearchCommand({
  renderAs = 'button',
  label = 'Add stock',
  initialStocks,
  open: controlledOpen,
  setOpen: controlledSetOpen
}: SearchCommandProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);
  const [watchlistStatus, setWatchlistStatus] = useState<Record<string, boolean>>({});

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledSetOpen || setInternalOpen;

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  // Fetch user's watchlist on mount to show correct star status
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await fetch('/api/watchlist', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          const watchlistSymbols = (data?.data || []).reduce((acc: Record<string, boolean>, item: { symbol: string }) => {
            acc[item.symbol] = true;
            return acc;
          }, {});
          setWatchlistStatus(watchlistSymbols);
        }
      } catch (error) {
        // Silently fail - user might not be logged in
        console.log('Could not fetch watchlist status');
      }
    };

    if (open) {
      fetchWatchlist();
    }
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v: boolean) => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [setOpen])

  const handleSearch = async () => {
    if (!isSearchMode) return setStocks(initialStocks);

    setLoading(true)
    try {
      const results = await searchStocks(searchTerm.trim());
      setStocks(results);
    } catch {
      setStocks([])
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm, debouncedSearch]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  }

  const handleWatchlistChange = (symbol: string, isAdded: boolean) => {
    setWatchlistStatus(prev => ({ ...prev, [symbol]: isAdded }));
  }

  // Don't render button if controlled from parent
  const showButton = controlledOpen === undefined;

  return (
    <>
      {showButton && (renderAs === 'text' ? (
        <span onClick={() => setOpen(true)} className="search-text">
          {label}
        </span>
      ) : (
        <Button onClick={() => setOpen(true)} className="search-btn">
          {label}
        </Button>
      ))}
      <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
        <div className="search-field">
          <CommandInput value={searchTerm} onValueChange={setSearchTerm} placeholder="Search stocks..." className="search-input" />
          {loading && <Loader2 className="search-loader" />}
        </div>
        <CommandList className="search-list">
          {loading ? (
            <CommandEmpty className="search-list-empty">Loading stocks...</CommandEmpty>
          ) : displayStocks?.length === 0 ? (
            <div className="search-list-indicator">
              {isSearchMode ? 'No results found' : 'No stocks available'}
            </div>
          ) : (
            <ul>
              <div className="search-count">
                {isSearchMode ? 'Search results' : 'Popular stocks'}
                {` `}({displayStocks?.length || 0})
              </div>
              {displayStocks?.map((stock, i) => (
                <li key={stock.symbol} className="search-item">
                  <Link
                    href={`/stocks/${stock.symbol}`}
                    onClick={handleSelectStock}
                    className="search-item-link flex-1"
                  >
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="search-item-name">
                        {stock.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {stock.symbol} | {stock.exchange} | {stock.type}
                      </div>
                    </div>
                  </Link>
                  <WatchlistButton
                    symbol={stock.symbol}
                    company={stock.name}
                    isInWatchlist={watchlistStatus[stock.symbol] || false}
                    type="icon"
                    onWatchlistChange={handleWatchlistChange}
                  />
                </li>
              ))}
            </ul>
          )
          }
        </CommandList>
      </CommandDialog>
    </>
  )
}