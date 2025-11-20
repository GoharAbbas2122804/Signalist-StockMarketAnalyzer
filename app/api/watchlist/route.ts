import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/better-auth/auth';
import { connectToDatabase } from '@/Database/mongoose';
import { Watchlist, type WatchlistItem } from '@/Database/models/watchlist.model';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const FINNHUB_TOKEN = process.env.FINNHUB_API_KEY ?? process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? '';

export const dynamic = 'force-dynamic';

async function getSession(request: NextRequest) {
  const auth = await getAuth();
  return auth.api.getSession({ headers: request.headers });
}

async function resolveUserId(sessionUser: { id?: string; email?: string }, db: any): Promise<string | null> {
  if (sessionUser?.id) return sessionUser.id;
  if (!sessionUser?.email || !db) return null;

  const dbUser = await db.collection('user').findOne<{ id?: string; _id?: unknown; email?: string }>({
    email: sessionUser.email,
  });

  if (!dbUser) return null;
  return dbUser.id || (dbUser._id ? String(dbUser._id) : null);
}

async function fetchQuote(symbol: string) {
  if (!FINNHUB_TOKEN) {
    return { currentPrice: null, changePercent: null };
  }

  try {
    const url = `${FINNHUB_BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_TOKEN}`;
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Quote fetch failed for ${symbol}`);
    }

    const data = (await response.json()) as { c?: number; dp?: number };
    return {
      currentPrice: typeof data.c === 'number' ? data.c : null,
      changePercent: typeof data.dp === 'number' ? data.dp : null,
    };
  } catch (error) {
    console.error('fetchQuote error:', error);
    return { currentPrice: null, changePercent: null };
  }
}

function unauthorizedResponse() {
  return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session?.user) {
      return unauthorizedResponse();
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    const userId = await resolveUserId(session.user, db);

    if (!userId) {
      return unauthorizedResponse();
    }

    const items = await Watchlist.find({ userId }).sort({ addedAt: -1 }).lean<WatchlistItem[]>();
    const enriched = await Promise.all(
      items.map(async (item) => {
        const quote = await fetchQuote(item.symbol);
        return {
          symbol: item.symbol,
          company: item.company,
          addedAt: item.addedAt ? item.addedAt.toISOString() : undefined,
          currentPrice: quote.currentPrice,
          changePercent: quote.changePercent,
          isInWatchlist: true,
        } satisfies WatchlistEntry;
      })
    );

    return NextResponse.json({ data: enriched });
  } catch (error) {
    console.error('GET /api/watchlist error:', error);
    return NextResponse.json({ message: 'Failed to load watchlist' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session?.user) {
      return unauthorizedResponse();
    }

    const body = await request.json().catch(() => null);
    const symbol = typeof body?.symbol === 'string' ? body.symbol.trim().toUpperCase() : '';
    const company = typeof body?.company === 'string' ? body.company.trim() : '';

    if (!symbol || !company) {
      return NextResponse.json({ message: 'Symbol and company are required' }, { status: 400 });
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    const userId = await resolveUserId(session.user, db);

    if (!userId) {
      return unauthorizedResponse();
    }

    await Watchlist.create({
      userId,
      symbol,
      company,
    });

    return NextResponse.json({ message: 'Added to watchlist' }, { status: 201 });
  } catch (error) {
    if ((error as any)?.code === 11000) {
      return NextResponse.json({ message: 'Stock already exists in your watchlist' }, { status: 409 });
    }

    console.error('POST /api/watchlist error:', error);
    return NextResponse.json({ message: 'Failed to add stock to watchlist' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session?.user) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const symbolParam = searchParams.get('symbol');
    const symbol = symbolParam?.trim().toUpperCase();

    if (!symbol) {
      return NextResponse.json({ message: 'Symbol query parameter is required' }, { status: 400 });
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    const userId = await resolveUserId(session.user, db);

    if (!userId) {
      return unauthorizedResponse();
    }

    await Watchlist.deleteOne({ userId, symbol });

    return NextResponse.json({ message: 'Removed from watchlist' });
  } catch (error) {
    console.error('DELETE /api/watchlist error:', error);
    return NextResponse.json({ message: 'Failed to remove stock from watchlist' }, { status: 500 });
  }
}

