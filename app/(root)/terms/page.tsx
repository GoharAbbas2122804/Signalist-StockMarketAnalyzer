import React from 'react';

const TermsPage = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold text-gray-100 mb-8">Terms of Service</h1>
            <div className="space-y-6 text-gray-400">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using Signalist, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
                    </p>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">2. Financial Disclaimer</h2>
                    <p>
                        Signalist provides financial data and analysis for informational purposes only. We are not financial advisors, and no content on our site constitutes financial advice.
                    </p>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
                    <p>
                        You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsPage;
