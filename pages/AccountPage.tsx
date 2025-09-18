import React from 'react';
import PageWrapper from '../components/PageWrapper';

const SectionWrapper: React.FC<{ title: string; description: string; children: React.ReactNode; }> = ({ title, description, children }) => (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        <p className="mt-1 text-gray-600 dark:text-gray-400">{description}</p>
        <div className="mt-4">
            {children}
        </div>
    </div>
);


const AccountPage: React.FC = () => {
  return (
    <PageWrapper title="Account Management">
      <div className="space-y-8">
        <SectionWrapper
            title="Email Address"
            description="Your email is used for login and account recovery."
        >
            <div className="flex items-center justify-between">
                <p className="text-gray-800 dark:text-gray-200">feroz@example.com</p>
                <button disabled className="px-4 py-2 text-sm font-medium bg-indigo-500 text-white rounded-lg cursor-not-allowed opacity-50">
                    Change Email
                </button>
            </div>
        </SectionWrapper>
        
        <SectionWrapper
            title="Password"
            description="It's a good idea to use a strong password that you're not using elsewhere."
        >
            <div className="flex items-center justify-between">
                <p className="text-gray-800 dark:text-gray-200">************</p>
                 <button disabled className="px-4 py-2 text-sm font-medium bg-indigo-500 text-white rounded-lg cursor-not-allowed opacity-50">
                    Change Password
                </button>
            </div>
        </SectionWrapper>

        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <h3 className="text-xl font-semibold text-red-800 dark:text-red-200">Delete Account</h3>
            <p className="mt-1 text-red-700 dark:text-red-300">
                Permanently delete your account and all of your content. This action is not reversible.
            </p>
            <div className="mt-4">
                 <button disabled className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg cursor-not-allowed opacity-50">
                    Delete My Account
                </button>
            </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AccountPage;
