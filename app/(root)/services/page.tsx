import React from 'react';

const ServicesPage = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold text-gray-100 mb-6">Our Services</h1>
            <div className="space-y-8">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h2 className="text-2xl font-semibold text-yellow-500 mb-3">Real-time Analysis</h2>
                    <p className="text-gray-400">
                        Get up-to-the-minute stock market data and comprehensive technical analysis to make informed investment decisions.
                    </p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h2 className="text-2xl font-semibold text-teal-400 mb-3">Portfolio Tracking</h2>
                    <p className="text-gray-400">
                        Monitor your investments with our advanced portfolio tracker, featuring profit/loss analysis and diversification metrics.
                    </p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h2 className="text-2xl font-semibold text-purple-500 mb-3">AI Predictions</h2>
                    <p className="text-gray-400">
                        Leverage our state-of-the-art machine learning models to identify potential market trends and opportunities.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
