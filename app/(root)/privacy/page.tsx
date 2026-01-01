import React from 'react';

const PrivacyPage = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold text-gray-100 mb-8">Privacy Policy</h1>
            <div className="space-y-6 text-gray-400">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us when you create an account, update your profile, or communicate with us.
                    </p>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to provide, maintain, and improve our services, analyze usage, and send you technical notices and support messages.
                    </p>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">3. Data Security</h2>
                    <p>
                        We implement appropriate technical and organizational measures to protect your personal information against unauthorized access or disclosure.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPage;
