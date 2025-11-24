import { NextResponse } from 'next/server'
import { getAuth } from '@/lib/better-auth/auth'
import { headers } from 'next/headers'
import { Watchlist } from '@/Database/models/watchlist.model'
import { connectToDatabase } from '@/Database/mongoose'

export async function GET() {
  try {
    const auth = await getAuth()
    const session = await auth.api.getSession({
      headers: await headers()
    })

    // Default metrics for guest users
    if (!session) {
      return NextResponse.json({
        watchlistCount: 3,
        portfolioValue: '$0.00',
        recentActivityCount: 0,
        accountAge: 'Guest',
        userName: 'Guest'
      })
    }

    // Connect to database
    await connectToDatabase()

    // Fetch actual watchlist count
    const watchlistCount = await Watchlist.countDocuments({ userId: session.user.id })

    // Calculate account age (days since creation)
    const userCreatedAt = session.user.createdAt 
      ? new Date(session.user.createdAt)
      : new Date()
    const accountAgeDays = Math.floor(
      (Date.now() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24)
    )
    const accountAge = accountAgeDays === 0 
      ? 'New account' 
      : `${accountAgeDays} ${accountAgeDays === 1 ? 'day' : 'days'} old`

    return NextResponse.json({
      watchlistCount,
      portfolioValue: '$125,432.50', // Dummy data - replace with real portfolio tracking
      recentActivityCount: watchlistCount > 0 ? Math.min(watchlistCount, 5) : 0, // Dummy based on watchlist
      accountAge,
      userName: session.user.name
    })
  } catch (error) {
    console.error('Dashboard metrics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    )
  }
}
