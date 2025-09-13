import { create } from 'zustand';

// This is your central store. It holds the user's token and role.
export const useAuthStore = create((set) => ({
  // State
  token: localStorage.getItem('authToken') || null,
  role: localStorage.getItem('userRole') || null,
  isAuthenticated: !!localStorage.getItem('authToken'),

  // Actions (functions to change the state)
  login: (token, role) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    set({ token, role, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    set({ token: null, role: null, isAuthenticated: false });
  },
}));