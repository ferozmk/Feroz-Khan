import React from 'react';
import PageWrapper from '../components/PageWrapper';

const HistoryPage: React.FC = () => {
  return (
    <PageWrapper title="Chat History">
      <div className="space-y-6">
        <div className="flex justify-between items-center gap-4">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search history..."
              disabled
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 cursor-not-allowed"
            />
          </div>
          <button
            disabled
            className="px-4 py-2 bg-red-500 text-white rounded-lg cursor-not-allowed opacity-50 whitespace-nowrap"
          >
            Clear History
          </button>
        </div>
        <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Your chat history will appear here.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            This feature is coming soon!
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default HistoryPage;
