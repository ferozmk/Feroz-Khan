import React from 'react';
import PageWrapper from '../components/PageWrapper';

const SavedChatsPage: React.FC = () => {
  return (
    <PageWrapper title="Saved Chats">
      <div className="text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No saved chats</h3>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          You can save important conversations to find them easily later.
        </p>
         <p className="mt-4 text-sm text-gray-400 dark:text-gray-500">
            This feature will be available soon.
          </p>
      </div>
    </PageWrapper>
  );
};

export default SavedChatsPage;
