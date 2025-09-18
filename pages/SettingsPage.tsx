import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { useRouter } from '../hooks/useRouter';

const SettingsCard: React.FC<{ title: string, description: string, onClick: () => void }> = ({ title, description, onClick }) => (
    <div
        onClick={onClick}
        className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all"
    >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);


const SettingsPage: React.FC = () => {
    const { navigate } = useRouter();

  return (
    <PageWrapper title="Settings">
      <div className="space-y-6">
        <SettingsCard 
            title="Language"
            description="Set your preferred language for the application interface."
            onClick={() => navigate('/language')}
        />
        <SettingsCard 
            title="Notifications"
            description="Configure how and when you receive notifications."
            onClick={() => navigate('/notifications')}
        />
      </div>
    </PageWrapper>
  );
};

export default SettingsPage;
