'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Construction, Sparkles, TrendingUp, Clock } from 'lucide-react'

const WatchlistPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-4">
        {/* Animated Icon/Logo Container */}
        <div className="relative mb-8 flex justify-center">
          <div className="relative">
            {/* Outer glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-yellow-500/20 to-yellow-400/20 rounded-full blur-2xl animate-pulse" />
            
            {/* Main icon container */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-full p-8 border-2 border-yellow-500/30 shadow-2xl">
              {/* Logo or Icon */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Image
                    src="/assets/icons/logo.svg"
                    alt="Signalist Logo"
                    width={120}
                    height={120}
                    className="w-24 h-24 md:w-32 md:h-32 opacity-90"
                  />
                  {/* Floating sparkles around logo */}
                  <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
                  <Sparkles className="absolute -bottom-2 -left-2 w-5 h-5 text-yellow-500 animate-pulse delay-300" />
                </div>
                
                {/* Construction icon overlay */}
                <div className="absolute top-4 right-4">
                  <Construction className="w-8 h-8 text-yellow-500 animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-6 mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-100 mb-4">
            Watchlist
            <span className="block text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mt-2">
              Coming Soon
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
            We're working hard to bring you an amazing watchlist experience! 
            Track your favorite stocks, set alerts, and manage your portfolio all in one place.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300">
            <TrendingUp className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-gray-100 font-semibold mb-2">Track Stocks</h3>
            <p className="text-sm text-gray-500">Monitor your favorite companies in real-time</p>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-gray-100 font-semibold mb-2">Smart Alerts</h3>
            <p className="text-sm text-gray-500">Get notified when stocks hit your targets</p>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300">
            <Sparkles className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-gray-100 font-semibold mb-2">AI Insights</h3>
            <p className="text-sm text-gray-500">Powered by advanced analytics</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-gray-900 font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/contact-us"
            className="px-6 py-3 bg-gray-800 border border-gray-600 hover:border-yellow-500/50 text-gray-300 font-semibold rounded-lg transition-all duration-300 hover:scale-105"
          >
            Get Notified
          </Link>
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span>We're building something amazing</span>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-300" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WatchlistPage

