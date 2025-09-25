import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface ThemeToggleProps {
  theme: string;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative inline-flex items-center justify-center w-12 h-12 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
    >
      <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
        {/* Sun Icon */}
        <div
          className={`absolute transition-all duration-300 ease-in-out ${
            isDark ? 'transform -translate-y-8 rotate-90 opacity-0' : 'transform translate-y-0 rotate-0 opacity-100'
          }`}
        >
          <SunIcon className="w-6 h-6 text-yellow-500" />
        </div>
        {/* Moon Icon */}
        <div
          className={`absolute transition-all duration-300 ease-in-out ${
            isDark ? 'transform translate-y-0 rotate-0 opacity-100' : 'transform translate-y-8 rotate-90 opacity-0'
          }`}
        >
          <MoonIcon className="w-6 h-6 text-indigo-400" />
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
