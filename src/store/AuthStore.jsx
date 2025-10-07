import { create } from 'zustand';
import { supabase } from '../supabaseClient';
import axios from 'axios';

const useAuthStore = create((set, get) => ({
  session: null,
  user: null,
  isAuthenticated: false,
  isFaceEnrolled: false,
  isVerified: false,
  role: null,
  loading: true, // --- Start with loading as true ---

  initialize: () => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        set({ session, isAuthenticated: true });
        get().fetchUser();
      } else {
        // --- If no session, stop loading and clear user data ---
        set({ session: null, user: null, isAuthenticated: false, role: null, isFaceEnrolled: false, isVerified: false, loading: false });
      }
    });

    // --- Check for initial session on app load ---
    const { data: { session } } = supabase.auth.getSession();
    if (session) {
      set({ session, isAuthenticated: true });
      get().fetchUser();
    } else {
      set({ loading: false }); // --- If no session, stop loading ---
    }
  },

  fetchUser: async () => {
    set({ loading: true }); // --- Set loading to true when fetching ---
    const token = get().session?.access_token;

    if (!token) {
      set({ loading: false });
      return;
    }

    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_HOST}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (data.user) {
        set({
          user: data.user,
          role: data.user.role,
          isFaceEnrolled: data.user.faceDescriptor && data.user.faceDescriptor.length > 0,
          isVerified: data.user.isVerified,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      set({ user: null, role: null, isAuthenticated: false, isFaceEnrolled: false, isVerified: false });
    } finally {
      set({ loading: false }); // --- Stop loading after fetch is complete ---
    }
  },

  updateFaceEnrollmentStatus: (status) => {
    set({ isFaceEnrolled: status });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, isAuthenticated: false, role: null, isFaceEnrolled: false, isVerified: false });
  },
}));

// Initialize the store
useAuthStore.getState().initialize();

export { useAuthStore };