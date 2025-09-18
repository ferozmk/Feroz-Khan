import React from 'react';

interface PageWrapperProps {
  title: string;
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, children }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-4">
          {title}
        </h1>
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageWrapper;
