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
  loading: true, // Initial loading state

  // New function to initialize the session
  initializeSession: () => {
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, isAuthenticated: !!session, loading: false }); // Set loading to false after check
      if (session) {
        get().fetchUser();
      } else {
        set({ user: null, role: null, isFaceEnrolled: false, isVerified: false });
      }
    });

    // Also check the initial session
    const { data: { session } } = supabase.auth.getSession();
    set({ session, isAuthenticated: !!session, loading: false }); // Set loading to false after initial check
    if (session) {
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
          // --- THE FIX: We need to check if the face descriptor exists and is not empty ---
          isFaceEnrolled: data.user.faceDescriptor && data.user.faceDescriptor.length > 0,
          isVerified: data.user.isVerified,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // If fetching user fails, sign them out
      get().signOut();
    }
  },

  // --- THE FIX: This new function will be called from the enrollment page ---
  updateFaceEnrollmentStatus: (status) => {
    set({ isFaceEnrolled: status });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, isAuthenticated: false, role: null, isFaceEnrolled: false, isVerified: false });
  },
}));

// We don't call initialize here anymore, it will be called from App.jsx
export { useAuthStore };