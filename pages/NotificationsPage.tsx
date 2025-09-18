import React, { useState, useEffect } from 'react';
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


const NotificationSetting: React.FC<{ title: string; description: string; checked: boolean; onToggle: (checked: boolean) => void; }> = ({ title, description, checked, onToggle }) => {
    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
            <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            <ToggleSwitch
                id={title.replace(/\s+/g, '-').toLowerCase()}
                checked={checked}
                onChange={onToggle}
            />
        </div>
    );
};

const NotificationsPage: React.FC = () => {
    const defaultSettings = {
        featureUpdates: true,
        weeklySummary: false,
        communityMentions: true,
    };

    const [settings, setSettings] = useState(defaultSettings);
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        const savedSettings = localStorage.getItem('notificationSettings');
        if (savedSettings) {
            try {
                setSettings(JSON.parse(savedSettings));
            } catch (error) {
                console.error("Failed to parse notification settings:", error);
            }
        }
    }, []);

    const handleToggle = (key: keyof typeof settings, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        localStorage.setItem('notificationSettings', JSON.stringify(settings));
        setSaveStatus('Saved!');
        setTimeout(() => setSaveStatus(''), 2000);
    };

  return (
    <PageWrapper title="Notification Settings">
        <div className="space-y-2">
            <NotificationSetting
                title="New Feature Updates"
                description="Get notified when we release new features and improvements."
                checked={settings.featureUpdates}
                onToggle={(value) => handleToggle('featureUpdates', value)}
            />
            <NotificationSetting
                title="Weekly Chat Summary"
                description="Receive a weekly summary of your most interesting conversations."
                checked={settings.weeklySummary}
                onToggle={(value) => handleToggle('weeklySummary', value)}
            />
            <NotificationSetting
                title="Community Mentions"
                description="Get an alert when someone mentions you in the community hub."
                checked={settings.communityMentions}
                onToggle={(value) => handleToggle('communityMentions', value)}
            />
        </div>
        <div className="flex justify-end pt-6 mt-4">
            <button 
                onClick={handleSave}
                disabled={!!saveStatus}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
            >
                {saveStatus || 'Save Preferences'}
            </button>
        </div>
    </PageWrapper>
  );
};

export default NotificationsPage;