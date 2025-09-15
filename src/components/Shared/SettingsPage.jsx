import React from 'react';
import { useThemeStore } from '../../store/ThemeStore';
import { Sun, Moon } from 'lucide-react';

const SettingsPage = () => {
  // Get the current theme and the toggle function from the store
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Settings</h2>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 max-w-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
        
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">Theme</p>
          
          <button 
            onClick={toggleTheme} 
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-5 h-5 text-yellow-500" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5 text-blue-400" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Change the appearance of the application. Your preference is saved automatically.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;