import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  // State
  token: localStorage.getItem('authToken') || null,
  role: localStorage.getItem('userRole') || null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  isVerified: false, // <-- NEW: Track if faculty has passed facial scan

  // Actions
  login: (token, role) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    // On login, they are authenticated but NOT yet verified
    set({ token, role, isAuthenticated: true, isVerified: false });
  },

  // NEW: Action to call after a successful face scan
  setVerified: () => set({ isVerified: true }),

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    // Reset everything on logout
    set({ token: null, role: null, isAuthenticated: false, isVerified: false });
  },
}));