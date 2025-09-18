import React, { useState } from 'react';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import AuthPage from './auth/AuthPage';
import { RobotIcon } from '../components/icons/RobotIcon';
import { LandingSidebar } from '../components/LandingSidebar';

interface LandingPageProps {
    onAuthSuccess: () => void;
    theme: string;
    toggleTheme: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAuthSuccess, theme, toggleTheme }) => {
    const [authAction, setAuthAction] = useState<'login' | 'signup' | null>(null);

    const renderContent = () => {
        if (authAction) {
            // We need to wrap AuthPage to simulate the full-page experience it expects
            return (
                 <div className="w-full h-full flex items-center justify-center">
                    <AuthPage onAuthSuccess={onAuthSuccess} />
                 </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <RobotIcon className="w-64 h-64 mb-8 text-indigo-500" />
                <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-100">
                    Welcome to FerozAI
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
                    Experience the next generation of conversational AI. Powerful, intuitive, and ready to assist you with any task.
                </p>
                <div className="mt-8 flex gap-4">
                    <button 
                        onClick={() => setAuthAction('signup')}
                        className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                    >
                        Get Started for Free
                    </button>
                    <button 
                        onClick={() => setAuthAction('login')}
                        className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        I have an account
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden">
            <main className="flex-1 flex flex-col overflow-y-auto">
                <header className="absolute top-0 left-0 p-6 flex items-center gap-2">
                     <SparklesIcon className="w-8 h-8 text-indigo-500" />
                     <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">FerozAI</span>
                </header>
                {renderContent()}
            </main>
            <LandingSidebar 
                onLoginClick={() => setAuthAction('login')} 
                onSignupClick={() => setAuthAction('signup')}
                theme={theme}
                toggleTheme={toggleTheme}
            />
        </div>
    );
};

export default LandingPage;
