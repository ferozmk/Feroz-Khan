import React from 'react';
import { UserIcon } from './icons/UserIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { LoginIcon } from './icons/LoginIcon';
import { UserPlusIcon } from './icons/UserPlusIcon';
import ThemeToggle from './ThemeToggle';

const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const BookmarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
);
const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.04 1.226-1.263a17.932 17.932 0 011.23 0c.665.223 1.135.721 1.225 1.263l.344 2.064a1.875 1.875 0 002.329 1.516l1.91-.765c.614-.245 1.3.055 1.632.664l.97 1.681c.333.578.156 1.33-.362 1.695l-1.68 1.009a1.875 1.875 0 000 2.986l1.68 1.009c.517.365.694 1.117.362 1.695l-.97 1.681c-.332.578-1.018.909-1.632.664l-1.91-.765a1.875 1.875 0 00-2.329 1.516l-.344 2.064c-.09.542-.56 1.04-1.225 1.263a17.932 17.932 0 01-1.23 0c-.665-.223-1.135-.721-1.226-1.263l-.344-2.064a1.875 1.875 0 00-2.329-1.516l-1.91.765c-.614-.245-1.3-.055-1.632.664l-.97-1.681c-.333-.578-.156-1.33.362-1.695l1.68-1.009a1.875 1.875 0 000-2.986l-1.68-1.009c-.517-.365-.694-1.117-.362-1.695l.97-1.681c.332.578 1.018.909 1.632.664l1.91.765a1.875 1.875 0 002.329-1.516l.344-2.064z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const HelpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);

interface LandingSidebarProps {
    onLoginClick: () => void;
    onSignupClick: () => void;
    theme: string;
    toggleTheme: () => void;
}

const FeatureLink: React.FC<{ icon: React.ReactNode; text: string; }> = ({ icon, text }) => (
    <div className="flex items-center gap-3 px-3 py-2.5 text-gray-500 dark:text-gray-400 cursor-default">
        {icon}
        <span className="font-medium">{text}</span>
    </div>
);

export const LandingSidebar: React.FC<LandingSidebarProps> = ({ onLoginClick, onSignupClick, theme, toggleTheme }) => {
    return (
        <aside className="w-72 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 flex flex-col gap-2 border-b border-gray-200 dark:border-gray-700">
                <button 
                    onClick={onLoginClick} 
                    className="flex items-center justify-center gap-2 w-full bg-indigo-500 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-600 transition-colors"
                >
                    <LoginIcon className="w-5 h-5" />
                    Login
                </button>
                <button 
                    onClick={onSignupClick}
                    className="flex items-center justify-center gap-2 w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    <UserPlusIcon className="w-5 h-5" />
                    Sign Up
                </button>
            </div>
            
            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto opacity-60">
                <h3 className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Features
                </h3>
                <FeatureLink icon={<UserIcon className="w-6 h-6" />} text="Account Section" />
                <FeatureLink icon={<HistoryIcon className="w-6 h-6" />} text="User History" />
                <FeatureLink icon={<BookmarkIcon className="w-6 h-6" />} text="Saved Chats" />
                <FeatureLink icon={<SettingsIcon className="w-6 h-6" />} text="Settings" />
                <FeatureLink icon={<UserIcon className="w-6 h-6" />} text="Profile & Preferences" />
                 <FeatureLink icon={<LogoutIcon className="w-6 h-6" />} text="Language Selector" />
                <FeatureLink icon={<HelpIcon className="w-6 h-6" />} text="Notifications" />
                <FeatureLink icon={<UserIcon className="w-6 h-6" />} text="Subscription Plan" />
                <FeatureLink icon={<HelpIcon className="w-6 h-6" />} text="Help / Support" />
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
        </aside>
    );
};
