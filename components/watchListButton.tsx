"use client";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { AuthPromptDialog } from "@/components/AuthPromptDialog";
import { handleSessionExpiration, showErrorToast, showSuccessToast } from "@/lib/utils/error-handling";

// Enhanced WatchlistButton with authentication checks
// Guests can view the button but must authenticate to perform actions
// Authenticated users have full functionality

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) => {
  const [added, setAdded] = useState<boolean>(!!isInWatchlist);
  const [isMutating, setIsMutating] = useState(false);
  const { requireAuth, showAuthPrompt, authPromptAction, closeAuthPrompt } = useAuthGuard();

  const normalizedSymbol = symbol.toUpperCase();
  const companyName = company?.trim() || normalizedSymbol;

  useEffect(() => {
    setAdded(!!isInWatchlist);
  }, [isInWatchlist]);

  const label = useMemo(() => {
    if (type === "icon") return added ? "" : "";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type]);

  const mutateWatchlist = useCallback(
    async (next: boolean) => {
      setIsMutating(true);
      try {
        const endpoint = "/api/watchlist";
        let response: Response;

        if (next) {
          response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              symbol: normalizedSymbol,
              company: companyName,
            }),
          });
        } else {
          const url = `${endpoint}?symbol=${encodeURIComponent(normalizedSymbol)}`;
          response = await fetch(url, { method: "DELETE" });
        }

        if (response.status === 401) {
          handleSessionExpiration();
          throw new Error("Authentication required");
        }

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.message || "Failed to update watchlist");
        }

        setAdded(next);
        onWatchlistChange?.(normalizedSymbol, next, { company: companyName });
        showSuccessToast(next ? "Added to watchlist" : "Removed from watchlist");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update watchlist";
        showErrorToast("Watchlist update failed", message);
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [companyName, normalizedSymbol, onWatchlistChange]
  );

  const handleClick = () => {
    const action = added ? "remove from watchlist" : "add to watchlist";
    const guardType = added ? "remove" : "add";

    requireAuth(
      action,
      async () => {
        const next = !added;
        await mutateWatchlist(next);
      },
      { guardType }
    );
  };

  if (type === "icon") {
    return (
      <>
        <button
          disabled={isMutating}
          title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
          aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
          className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""} ${isMutating ? "opacity-70 cursor-not-allowed" : ""}`}
          onClick={handleClick}
          aria-busy={isMutating}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={added ? "#FACC15" : "none"}
            stroke="#FACC15"
            strokeWidth="1.5"
            className="watchlist-star"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
            />
          </svg>
        </button>
        <AuthPromptDialog
          open={showAuthPrompt}
          onOpenChange={closeAuthPrompt}
          action={authPromptAction}
        />
      </>
    );
  }

  return (
    <>
      <button
        className={`watchlist-btn ${added ? "watchlist-remove" : ""} ${isMutating ? "opacity-70 cursor-not-allowed" : ""}`}
        onClick={handleClick}
        disabled={isMutating}
        aria-busy={isMutating}
      >
        {showTrashIcon && added ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6" />
          </svg>
        ) : null}
        <span>{label}</span>
      </button>
      <AuthPromptDialog
        open={showAuthPrompt}
        onOpenChange={closeAuthPrompt}
        action={authPromptAction}
      />
    </>
  );
};

export default WatchlistButton;