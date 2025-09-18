import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';

// A simple, accessible toggle switch component
const ToggleSwitch: React.FC<{ id: string; checked: boolean; onChange: (checked: boolean) => void; }> = ({ id, checked, onChange }) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`${checked ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
        >
            <span
                aria-hidden="true"
                className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    );
};


const NotificationSetting: React.FC<{ title: string; description: string; initialChecked: boolean; }> = ({ title, description, initialChecked }) => {
    const [isEnabled, setIsEnabled] = useState(initialChecked);

    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
            <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            <ToggleSwitch
                id={title.replace(/\s+/g, '-').toLowerCase()}
                checked={isEnabled}
                onChange={setIsEnabled}
            />
        </div>
    );
};

const NotificationsPage: React.FC = () => {
  return (
    <PageWrapper title="Notification Settings">
        <div className="space-y-2">
            <NotificationSetting
                title="New Feature Updates"
                description="Get notified when we release new features and improvements."
                initialChecked={true}
            />
            <NotificationSetting
                title="Weekly Chat Summary"
                description="Receive a weekly summary of your most interesting conversations."
                initialChecked={false}
            />
            <NotificationSetting
                title="Community Mentions"
                description="Get an alert when someone mentions you in the community hub."
                initialChecked={true}
            />
        </div>
        <div className="flex justify-end pt-6 mt-4">
            <button disabled className="px-6 py-2 bg-indigo-500 text-white rounded-lg cursor-not-allowed opacity-50">
                Save Preferences
            </button>
        </div>
    </PageWrapper>
  );
};

export default NotificationsPage;
