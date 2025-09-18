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
import CommunityPage from './pages/CommunityPage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/auth/AuthPage';

const App: React.FC = () => {
  const { path } = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, login, logout } = useAuth();

  const renderPage = () => {
    switch (path) {
      case '/':
        return <ChatInterface />;
      case '/dashboard':
        return <DashboardPage />;
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
      case '/community':
        return <CommunityPage />;
      case '/about':
        return <AboutPage />;
      default:
        return <ChatInterface />;
    }
  };
  
  return (
    <div className={`${theme} font-sans`}>
      {isAuthenticated ? (
        <div className="flex flex-row-reverse h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          <SidebarMenu
            isSidebarOpen={isSidebarOpen}
            setSidebarOpen={setSidebarOpen}
            theme={theme}
            toggleTheme={toggleTheme}
            logout={logout}
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
        <AuthPage onAuthSuccess={login} />
      )}
    </div>
  );
};

export default App;