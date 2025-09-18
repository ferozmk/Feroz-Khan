import React from 'react';
import PageWrapper from '../../components/PageWrapper';

const ApiUsagePage: React.FC = () => {
  return (
    <PageWrapper title="API Usage">
      <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">API Keys & Usage</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage your API keys and monitor your token consumption here.
          </p>
          <p className="mt-4 text-sm text-gray-400 dark:text-gray-500">
              This feature is coming soon.
          </p>
      </div>
    </PageWrapper>
  );
};

export default ApiUsagePage;