import React, { useState } from 'react';
import { useRouter } from './hooks/useRouter';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import SidebarMenu from './components/SidebarMenu';
import ChatInterface from './components/ChatInterface';
import AccountPage from './pages/AccountPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import SavedChatsPage from './pages/SavedChatsPage';
import LanguagePage from './pages/LanguagePage';
import NotificationsPage from './pages/NotificationsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import ImageGalleryPage from './pages/ImageGalleryPage';
import { MenuIcon } from './components/icons/MenuIcon';
import ImageGeneratorEditorPage from './pages/ImageGeneratorEditorPage';
import VideoGeneratorPage from './pages/VideoGeneratorPage';
import CommunityPage from './pages/CommunityPage';
import AboutPage from './pages/AboutPage';
import UserActivityPage from './pages/dashboard/UserActivityPage';
import ApiUsagePage from './pages/dashboard/ApiUsagePage';
import ContentAnalyticsPage from './pages/dashboard/ContentAnalyticsPage';
import TeamManagementPage from './pages/dashboard/TeamManagementPage';
import { LogoIcon } from './components/icons/LogoIcon';
import AuthPage from './pages/auth/AuthPage';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative flex items-center justify-center w-32 h-32">
        <svg className="absolute w-full h-full animate-spin" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "rgb(99, 102, 241)", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "rgb(99, 102, 241)", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#spinner-gradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
        <LogoIcon className="w-16 h-16" />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { path } = useRouter();
  // The useTheme hook handles applying the 'dark' class to the <html> element,
  // making the theme globally available to Tailwind's dark: variants.
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading: isAuthLoading, logout } = useAuth();

  // Show loading screen while checking auth state
  if (isAuthLoading) {
    return (
      <div className="font-sans">
        <LoadingAnimation />
      </div>
    );
  }

  const renderPage = () => {
    switch (path) {
      case '/':
        return <ChatInterface user={user} />;
      case '/dashboard':
      case '/dashboard/activity':
        return <UserActivityPage />;
      case '/dashboard/api-usage':
        return <ApiUsagePage />;
      case '/dashboard/analytics':
        return <ContentAnalyticsPage />;
      case '/dashboard/team':
        return <TeamManagementPage />;
      case '/profile':
        return <ProfilePage />;
      case '/account':
        return <AccountPage />;
      case '/history':
        return <HistoryPage />;
      case '/saved-chats':
        return <SavedChatsPage />;
      case '/settings':
        return <SettingsPage />;
      case '/profile-settings':
        return <ProfileSettingsPage />;
      case '/language':
        return <LanguagePage />;
      case '/notifications':
        return <NotificationsPage />;
      case '/subscription':
        return <SubscriptionPage />;
      case '/help':
        return <HelpPage />;
      case '/image-gallery':
        return <ImageGalleryPage />;
      case '/image-generator-editor':
        return <ImageGeneratorEditorPage />;
      case '/video-generator':
        return <VideoGeneratorPage />;
      case '/community':
        return <CommunityPage />;
      case '/about':
        return <AboutPage />;
      default:
        return <ChatInterface user={user} />;
    }
  };
  
  return (
    <div className="font-sans">
      {user ? (
        <div className="flex flex-row-reverse h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          <SidebarMenu
            isSidebarOpen={isSidebarOpen}
            setSidebarOpen={setSidebarOpen}
            theme={theme}
            toggleTheme={toggleTheme}
            logout={logout}
            user={user}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-semibold">FerozAI</h1>
              <button onClick={() => setSidebarOpen(true)} className="p-2">
                <MenuIcon />
              </button>
            </header>
            {renderPage()}
          </div>
        </div>
      ) : (
        <AuthPage />
      )}
    </div>
  );
};

export default App;