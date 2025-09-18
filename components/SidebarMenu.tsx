import React from 'react';
import { useRouter } from '../hooks/useRouter';
import { SparklesIcon } from './icons/SparklesIcon';
import { UserIcon } from './icons/UserIcon';
import { ImageIcon } from './icons/ImageIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { DashboardIcon } from './icons/DashboardIcon';
import { AIToolsIcon } from './icons/AIToolsIcon';
import { CommunityIcon } from './icons/CommunityIcon';
import { AboutIcon } from './icons/AboutIcon';
import { HomeIcon } from './icons/HomeIcon';

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);
const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.04 1.226-1.263a17.932 17.932 0 011.23 0c.665.223 1.135.721 1.225 1.263l.344 2.064a1.875 1.875 0 002.329 1.516l1.91-.765c.614-.245 1.3.055 1.632.664l.97 1.681c.333.578.156 1.33-.362 1.695l-1.68 1.009a1.875 1.875 0 000 2.986l1.68 1.009c.517.365.694 1.117.362 1.695l-.97 1.681c-.332.578-1.018.909-1.632.664l-1.91-.765a1.875 1.875 0 00-2.329 1.516l-.344 2.064c-.09.542-.56 1.04-1.225 1.263a17.932 17.932 0 01-1.23 0c-.665-.223-1.135-.721-1.226-1.263l-.344-2.064a1.875 1.875 0 00-2.329-1.516l-1.91.765c-.614-.245-1.3-.055-1.632-.664l-.97-1.681c-.333-.578-.156-1.33.362-1.695l1.68-1.009a1.875 1.875 0 000-2.986l-1.68-1.009c-.517-.365-.694-1.117-.362-1.695l.97-1.681c.332-.578 1.018.909 1.632.664l1.91.765a1.875 1.875 0 002.329-1.516l.344-2.064z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const HelpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);
const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.95-4.243l-1.59-1.591M3.75 12H6m4.243-4.95l-1.59 1.59M12 12a4.5 4.5 0 000 9 4.5 4.5 0 000-9z" />
    </svg>
);
const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

interface SidebarMenuProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  theme: string;
  toggleTheme: () => void;
  logout: () => void;
}

const NavLink: React.FC<{ href: string; icon: React.ReactNode; text: string; setSidebarOpen: (isOpen: boolean) => void; }> = ({ href, icon, text, setSidebarOpen }) => {
    const { navigate, path } = useRouter();
    const isActive = path === href;
    return (
        <a
            href={`#${href}`}
            onClick={(e) => { e.preventDefault(); navigate(href); setSidebarOpen(false); }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-base ${
                isActive
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
            }`}
        >
            {icon}
            <span className="font-medium">{text}</span>
        </a>
    );
};

const NavSectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <h3 className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {title}
    </h3>
);

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isSidebarOpen, setSidebarOpen, theme, toggleTheme, logout }) => {
  const { navigate } = useRouter();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-30 transition-opacity md:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 z-40 transform transition-transform md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); setSidebarOpen(false); }} className="flex items-center gap-2">
              <SparklesIcon className="w-8 h-8 text-indigo-500" />
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">FerozAI</span>
            </a>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </header>

          <div className="p-4">
            <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); setSidebarOpen(false); }} className="flex items-center justify-center gap-2 w-full bg-indigo-500 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-600 transition-colors">
              <PlusIcon className="w-5 h-5" />
              New Chat
            </a>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            <NavSectionHeader title="Tools" />
            <NavLink href="/" icon={<HomeIcon className="w-6 h-6" />} text="Chat" setSidebarOpen={setSidebarOpen} />
            <NavLink href="/dashboard" icon={<DashboardIcon className="w-6 h-6" />} text="Dashboard" setSidebarOpen={setSidebarOpen} />
            <NavLink href="/image-generator-editor" icon={<ImageIcon className="w-6 h-6" />} text="Image Generator & Editor" setSidebarOpen={setSidebarOpen} />

            <NavSectionHeader title="Library" />
            <NavLink href="/history" icon={<HistoryIcon className="w-6 h-6" />} text="History" setSidebarOpen={setSidebarOpen} />
            <NavLink href="/saved-chats" icon={<BookmarkIcon className="w-6 h-6" />} text="Saved Chats" setSidebarOpen={setSidebarOpen} />
            <NavLink href="/image-gallery" icon={<ImageIcon className="w-6 h-6" />} text="Image Gallery" setSidebarOpen={setSidebarOpen} />

            <NavSectionHeader title="General" />
            <NavLink href="/community" icon={<CommunityIcon className="w-6 h-6" />} text="Community" setSidebarOpen={setSidebarOpen} />
            <NavLink href="/about" icon={<AboutIcon className="w-6 h-6" />} text="About" setSidebarOpen={setSidebarOpen} />
            <NavLink href="/settings" icon={<SettingsIcon className="w-6 h-6" />} text="Settings" setSidebarOpen={setSidebarOpen} />
            <NavLink href="/help" icon={<HelpIcon className="w-6 h-6" />} text="Help" setSidebarOpen={setSidebarOpen} />
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <a href="#/profile" onClick={(e) => { e.preventDefault(); navigate('/profile'); setSidebarOpen(false); }} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-500">Feroz</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Free Plan</p>
                    </div>
                </a>
                <button onClick={logout} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Logout">
                    <LogoutIcon className="w-6 h-6" />
                </button>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                 onClick={toggleTheme}
                 className="w-full flex items-center justify-center gap-3 p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
             >
                 {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                 <span className="font-medium text-base">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
             </button>
            </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarMenu;