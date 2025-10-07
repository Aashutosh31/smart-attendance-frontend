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
  loading: true,

  initialize: () => {
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, isAuthenticated: !!session, loading: true });
      if (session) {
        get().fetchUser();
      } else {
        set({ user: null, role: null, isFaceEnrolled: false, isVerified: false, loading: false });
      }
    });

    const initialSession = supabase.auth.getSession();
    if (initialSession) {
        set({ session: initialSession, isAuthenticated: !!initialSession, loading: true });
        get().fetchUser();
    } else {
        set({loading: false});
    }
  },

  fetchUser: async () => {
    set({ loading: true }); // --- THIS IS THE FIX ---
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
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // On error, reset the state
      set({ user: null, role: null, isAuthenticated: false, isFaceEnrolled: false, isVerified: false });
    } finally {
      set({ loading: false });
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
// Initialize the store right away
useAuthStore.getState().initialize();

export { useAuthStore };