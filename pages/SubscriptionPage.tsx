import React from 'react';
import PageWrapper from '../components/PageWrapper';

const CheckIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-green-500" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const SubscriptionPage: React.FC = () => {
  return (
    <PageWrapper title="Subscription">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Current Plan */}
        <div className="border border-indigo-500 rounded-lg p-6 shadow-lg relative bg-white dark:bg-gray-800">
            <span className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Current Plan</span>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Free Tier</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Perfect for getting started.</p>
            <ul className="mt-6 space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-3"><CheckIcon /> Standard AI model access</li>
                <li className="flex items-center gap-3"><CheckIcon /> Basic chat history</li>
                <li className="flex items-center gap-3"><CheckIcon /> Community support</li>
            </ul>
        </div>

        {/* Upgrade Plan */}
        <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">FerozAI Pro</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Unlock the full potential.</p>
            <ul className="mt-6 space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-3"><CheckIcon /> Advanced AI models</li>
                <li className="flex items-center gap-3"><CheckIcon /> Unlimited chat history</li>
                <li className="flex items-center gap-3"><CheckIcon /> Priority support</li>
                <li className="flex items-center gap-3"><CheckIcon /> Exclusive new features</li>
            </ul>
            <button disabled className="mt-8 w-full py-2 px-4 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-70">
                Upgrade (Coming Soon)
            </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SubscriptionPage;
