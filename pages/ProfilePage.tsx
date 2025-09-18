import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { useRouter } from '../hooks/useRouter';

const ProfileCard: React.FC<{ title: string; description: string; onClick: () => void, disabled?: boolean }> = ({ title, description, onClick, disabled }) => (
    <div
        onClick={!disabled ? onClick : undefined}
        className={`p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm transition-all ${disabled ? 'opacity-60' : 'hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'}`}
    >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

const ProfilePage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <PageWrapper title="Profile & Preferences">
      <div className="space-y-6">
          <ProfileCard
              title="Profile Settings"
              description="Update your name, avatar, and other personal details."
              onClick={() => navigate('/profile-settings')}
          />
          <ProfileCard
              title="Account Management"
              description="Manage your email, password, and account security."
              onClick={() => navigate('/account')}
          />
          <ProfileCard
              title="Theme & Appearance"
              description="Customize the look and feel of the application."
              onClick={() => {}}
              disabled={true}
          />
      </div>
    </PageWrapper>
  );
};

export default ProfilePage;
