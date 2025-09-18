import React from 'react';
import PageWrapper from '../../components/PageWrapper';

const TeamManagementPage: React.FC = () => {
  return (
    <PageWrapper title="Team Management">
      <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Manage Your Team</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Invite and manage team members to collaborate within FerozAI.
          </p>
           <p className="mt-4 text-sm text-gray-400 dark:text-gray-500">
              This feature is currently unavailable.
          </p>
      </div>
    </PageWrapper>
  );
};

export default TeamManagementPage;