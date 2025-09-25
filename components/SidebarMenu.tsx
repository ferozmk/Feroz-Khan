import React from 'react';
// Import firebase for the User type, but remove the database (db) import.
import firebase from '../services/firebase';
import { useRouter } from '../hooks/useRouter';
import ThemeToggle from './ThemeToggle';

// Icons
import { LogoIcon } from './icons/LogoIcon';
import { HomeIcon } from './icons/HomeIcon';
import { ImageIcon } from './icons/ImageIcon';
import { VideoIcon } from './icons/VideoIcon';
import { DashboardIcon } from './icons/DashboardIcon';
import { CommunityIcon } from './icons/CommunityIcon';
import { AboutIcon } from './icons/AboutIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { UserIcon } from './icons/UserIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';

// Define prop types to match what is passed from App.tsx. This fixes the type error.
type SidebarMenuProps = {
  isSidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  theme: string;
  toggleTheme: () => void;
  logout: () => Promise<void>;
  user: firebase.User;
};

// Locally define icons that are not in separate component files, similar to LandingSidebar.tsx.
const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
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

const NavLink: React.FC<{ href: string; currentPath: string; navigate: (path: string) => void; setSidebarOpen: (isOpen: boolean) => void; children: React.ReactNode; }> = ({ href, currentPath, navigate, setSidebarOpen, children }) => {
    const isActive = href === '/' ? currentPath === href : currentPath.startsWith(href);
    const linkClasses = `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-indigo-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`;

    return (
        <a href={`#${href}`} className={linkClasses} onClick={(e) => {
            e.preventDefault();
            navigate(href);
            setSidebarOpen(false);
        }}>
            {children}
        </a>
    );
};

// Define the type for menu items.
type MenuItem = {
  id: string;
  href: string;
  text: string;
  icon: string; // This will be the key for the iconMap
  order: number;
};

// Map icon names (strings from the database) to actual React components.
const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    HomeIcon,
    ImageIcon,
    VideoIcon,
    DashboardIcon,
    HistoryIcon,
    BookmarkIcon,
    CommunityIcon,
    AboutIcon,
    HelpIcon,
};

// Hardcode the menu items to fix the permission error and improve performance.
const menuItems: MenuItem[] = [
  { id: '1', href: '/', text: 'Home', icon: 'HomeIcon', order: 1 },
  { id: '2', href: '/image-generator-editor', text: 'Image Tools', icon: 'ImageIcon', order: 2 },
  { id: '9', href: '/video-generator', text: 'Video Tools', icon: 'VideoIcon', order: 3 },
  { id: '3', href: '/dashboard', text: 'Dashboard', icon: 'DashboardIcon', order: 4 },
  { id: '4', href: '/history', text: 'History', icon: 'HistoryIcon', order: 5 },
  { id: '5', href: '/saved-chats', text: 'Saved Chats', icon: 'BookmarkIcon', order: 6 },
  { id: '6', href: '/community', text: 'Community', icon: 'CommunityIcon', order: 7 },
  { id: '7', href: '/about', text: 'About', icon: 'AboutIcon', order: 8 },
  { id: '8', href: '/help', text: 'Help', icon: 'HelpIcon', order: 9 },
];


const SidebarMenu: React.FC<SidebarMenuProps> = ({ isSidebarOpen, setSidebarOpen, theme, toggleTheme, logout, user }) => {
    const { path, navigate } = useRouter();

    return (
        <>
            <div className={`fixed inset-0 bg-black/30 z-30 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)} />
            <aside className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0 md:w-72 md:flex-shrink-0`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LogoIcon className="w-8 h-8" />
                        <span className="text-2xl font-bold">FerozAI</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                    {menuItems.sort((a, b) => a.order - b.order).map(item => {
                        const IconComponent = iconMap[item.icon];
                        if (!IconComponent) {
                            console.warn(`Icon "${item.icon}" not found for menu item "${item.text}"`);
                            return null; // Or render a default fallback icon
                        }
                        return (
                             <NavLink key={item.id} href={item.href} currentPath={path} navigate={navigate} setSidebarOpen={setSidebarOpen}>
                                <IconComponent className="w-6 h-6" />
                                <span className="font-medium">{item.text}</span>
                            </NavLink>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col gap-1">
                         <NavLink href="/profile" currentPath={path} navigate={navigate} setSidebarOpen={setSidebarOpen}>
                            <UserIcon className="w-6 h-6" />
                            <span className="font-medium">Profile</span>
                        </NavLink>
                        <NavLink href="/settings" currentPath={path} navigate={navigate} setSidebarOpen={setSidebarOpen}>
                            <SettingsIcon className="w-6 h-6" />
                            <span className="font-medium">Settings</span>
                        </NavLink>
                         <a onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                            <LogoutIcon className="w-6 h-6" />
                            <span className="font-medium">Logout</span>
                        </a>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium truncate">{user.displayName || user.email}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">© FerozAI</p>
                        </div>
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    </div>
                </div>
            </aside>
        </>
    );
};

export default SidebarMenu;