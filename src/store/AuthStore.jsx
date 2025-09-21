import { create } from 'zustand';
import { supabase } from '../supabaseClient';
import apiClient from '../api/apiClient'; // Import our new API client

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: true,

  initialize: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (session) {
      await get().fetchUserProfile(session);
    } else {
      set({ loading: false });
    }
    
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        get().fetchUserProfile(session);
      } else {
        set({ user: null, accessToken: null, isAuthenticated: false });
      }
    });
  },

  fetchUserProfile: async (session) => {
    try {
      const profile = await apiClient('/api/accounts/profile/'); // Use the apiClient
      set({
        user: profile,
        accessToken: session.access_token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // If fetching the Django profile fails, we should still clear the session
      // to prevent an inconsistent state.
      await get().signOut(); 
      set({ loading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, accessToken: null, isAuthenticated: false, loading: false });
  },
}));

// Initialize the store right away
useAuthStore.getState().initialize();

export { useAuthStore };