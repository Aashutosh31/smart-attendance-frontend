import { create } from 'zustand';
import { supabase } from '../supabaseClient';
import axios from 'axios';

// Add signIn function to the store!
const useAuthStore = create((set, get) => ({
  session: null,
  user: null,
  isAuthenticated: false,
  isFaceEnrolled: false,
  isVerified: false,
  role: null,
  loading: false,

  initializeSession: async () => {
    // Listen for auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, isAuthenticated: !!session, loading: false });
      if (session) {
        get().fetchUser();
      } else {
        set({ user: null, role: null, isFaceEnrolled: false, isVerified: false });
      }
    });

    // Initial session check (must await for correct SSR/CSR)
    const { data } = await supabase.auth.getSession();
    set({ session: data.session, isAuthenticated: !!data.session, loading: false });
    if (data.session) {
      get().fetchUser();
    }
  },

  fetchUser: async () => {
    const token = get().session?.access_token;
    if (!token) return;

    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_HOST}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.user) {
        set({
          user: data.user,
          role: data.user.role,
          isFaceEnrolled: !!(data.user.faceDescriptor && data.user.faceDescriptor.length > 0),
          isVerified: !!data.user.isVerified,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      get().signOut();
    }
  },

  signIn: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ loading: false });
      return { error };
    }
    set({ session: data.session, isAuthenticated: !!data.session, loading: false });
    if (data.session) {
      await get().fetchUser();
    }
    return { error: null };
  },

  updateFaceEnrollmentStatus: (status) => {
    set({ isFaceEnrolled: status });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, isAuthenticated: false, role: null, isFaceEnrolled: false, isVerified: false });
  },
}));

export { useAuthStore };