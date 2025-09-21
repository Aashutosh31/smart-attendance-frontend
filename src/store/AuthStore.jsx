// src/stores/authstore.jsx
import { create } from 'zustand';

// Define the store's state and actions
const useAuthStore = create((set) => ({
  // State
  isAuthenticated: false,
  user: null, // Stores user data, e.g., { id, email, name }
  token: null, // Stores the authentication token

  // Actions
  login: (userData, authToken) => set({
    isAuthenticated: true,
    user: userData,
    token: authToken,
  }),

  logout: () => set({
    isAuthenticated: false,
    user: null,
    token: null,
  }),

  // Optional: Action to update the user data
  updateUser: (newUserData) => set((state) => ({
    user: { ...state.user, ...newUserData },
  })),

}));

export default useAuthStore;