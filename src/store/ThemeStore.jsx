import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      // State: 'light' or 'dark'
      theme: 'light', 

      // Action: function to toggle the theme
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
    }),
    {
      // The key to use for storing the data in localStorage
      name: 'app-theme', 
    }
  )
);