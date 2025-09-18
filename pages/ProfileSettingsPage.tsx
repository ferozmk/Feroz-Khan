import React from 'react';
import PageWrapper from '../components/PageWrapper';

const ProfileSettingsPage: React.FC = () => {
  return (
    <PageWrapper title="Profile Settings">
      <div className="space-y-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Profile Picture</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Upload a new avatar.</p>
            <button disabled className="mt-2 px-4 py-2 text-sm font-medium bg-indigo-500 text-white rounded-lg cursor-not-allowed opacity-50">
              Change Avatar
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              defaultValue="Feroz Khan"
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 shadow-sm cursor-not-allowed p-2"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              defaultValue="feroz_ai_dev"
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 shadow-sm cursor-not-allowed p-2"
            />
          </div>
           <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              rows={3}
              defaultValue="Passionate software engineer building beautiful and functional user interfaces."
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 shadow-sm cursor-not-allowed p-2 resize-none"
            />
          </div>
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
             <button type="submit" disabled className="px-6 py-2 bg-indigo-500 text-white rounded-lg cursor-not-allowed opacity-50">
                Save Changes
              </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default ProfileSettingsPage;
