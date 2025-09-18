import React, { useState } from 'react';
import { GoogleIcon } from '../../components/icons/GoogleIcon';
import { LogoIcon } from '../../components/icons/LogoIcon';

interface AuthPageProps {
  onAuthSuccess: () => void;
  initialView?: 'login' | 'signup';
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, initialView = 'signup' }) => {
  const [isLoginView, setIsLoginView] = useState(initialView === 'login');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send credentials to a server for validation.
    // Here, we'll just simulate a successful authentication.
    onAuthSuccess();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="text-center">
            <LogoIcon className="w-10 h-10 mx-auto" />
            <h1 className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-100">
                {isLoginView ? 'Welcome Back' : 'Welcome to FerozAI'}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
                {isLoginView ? 'Sign in to continue your session.' : 'Get started with the future of AI.'}
            </p>
        </div>
        
        <button
          onClick={onAuthSuccess}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <GoogleIcon className="w-6 h-6" />
          <span>Sign {isLoginView ? 'in' : 'up'} with Google</span>
        </button>

        <div className="flex items-center before:h-px before:flex-1 before:bg-gray-300 dark:before:bg-gray-600 before:content-[''] after:h-px after:flex-1 after:bg-gray-300 dark:after:bg-gray-600 after:content-['']">
            <span className="px-3 text-sm text-gray-500 dark:text-gray-400">OR</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLoginView && (
            <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Full Name"
                />
            </div>
          )}
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            Sign {isLoginView ? 'In' : 'Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLoginView(!isLoginView)} className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
            {isLoginView ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;