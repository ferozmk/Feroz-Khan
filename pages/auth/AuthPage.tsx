import React, { useState, useEffect } from 'react';
// Import both the auth instance and the firebase namespace from the centralized service.
import firebase, { auth } from '../../services/firebase';
import { GoogleIcon } from '../../components/icons/GoogleIcon';
import { LogoIcon } from '../../components/icons/LogoIcon';
import { verifyRecaptcha } from '../../services/recaptchaService';

interface AuthPageProps {
  initialView?: 'login' | 'signup';
}

const AuthPage: React.FC<AuthPageProps> = ({ initialView = 'signup' }) => {
  const [isLoginView, setIsLoginView] = useState(initialView === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading to check for redirect result

  // Use the firebase.auth.AuthError type from the imported firebase object.
  const handleAuthError = (err: firebase.auth.AuthError) => {
    setError(err.message || 'An unknown authentication error occurred.');
  };

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        // Use the v8 compat `getRedirectResult` method to check for sign-in results
        await auth.getRedirectResult();
      } catch (err) {
        handleAuthError(err as firebase.auth.AuthError);
      } finally {
        setIsLoading(false);
      }
    };
    checkRedirectResult();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1. Verify with reCAPTCHA before attempting to authenticate.
      const recaptchaAction = isLoginView ? 'login' : 'signup';
      const recaptchaResult = await verifyRecaptcha(recaptchaAction);

      if (!recaptchaResult.success) {
          throw new Error(recaptchaResult.message || 'reCAPTCHA validation failed.');
      }
      
      // 2. If reCAPTCHA is successful, proceed with Firebase Auth.
      if (isLoginView) {
        // Use the v8 compat `signInWithEmailAndPassword` method
        await auth.signInWithEmailAndPassword(email, password);
      } else {
        // Use the v8 compat `createUserWithEmailAndPassword` method
        await auth.createUserWithEmailAndPassword(email, password);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
        // 1. Verify with reCAPTCHA.
        const recaptchaResult = await verifyRecaptcha('google_signin');

        if (!recaptchaResult.success) {
            throw new Error(recaptchaResult.message || 'reCAPTCHA validation failed.');
        }

        // 2. Proceed with Google Sign In.
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithRedirect(provider);
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred.');
        }
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="text-center">
            <LogoIcon className="w-10 h-10 mx-auto text-indigo-500" />
            <h1 className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-100">
                {isLoginView ? 'Welcome Back' : 'Welcome to FerozAI'}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
                {isLoginView ? 'Sign in to continue your session.' : 'Get started with the future of AI.'}
            </p>
        </div>
        
        {error && (
            <div className="p-3 text-center text-sm text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900/30 rounded-lg">
                {error}
            </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          <GoogleIcon className="w-6 h-6" />
          <span>Sign {isLoginView ? 'in' : 'up'} with Google</span>
        </button>

        <div className="flex items-center before:h-px before:flex-1 before:bg-gray-300 dark:before:bg-gray-600 before:content-[''] after:h-px after:flex-1 after:bg-gray-300 dark:after:bg-gray-600 after:content-['']">
            <span className="px-3 text-sm text-gray-500 dark:text-gray-400">OR</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email address"
              disabled={isLoading}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : `Sign ${isLoginView ? 'In' : 'Up'}`}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => { setIsLoginView(!isLoginView); setError(null); }} className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
            {isLoginView ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;