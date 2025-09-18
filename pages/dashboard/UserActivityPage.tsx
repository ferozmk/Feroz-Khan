import React from 'react';
import PageWrapper from '../../components/PageWrapper';

const UserActivityPage: React.FC = () => {
  return (
    <PageWrapper title="User Activity">
      <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Activity Data</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Charts and statistics about your usage will be displayed here.
          </p>
          <p className="mt-4 text-sm text-gray-400 dark:text-gray-500">
              This feature is under construction.
          </p>
      </div>
    </PageWrapper>
  );
};

export default UserActivityPage;