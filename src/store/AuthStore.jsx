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
initializeSession: async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error fetching session:', error.message);
      set({ session: null, user: null, isAuthenticated: false }); // Clear auth state on error
      return;
    }

    // THIS IS THE KEY FIX:
    // Safely access the session, defaulting to null if data is not present.
    const session = data?.session ?? null;

    set({
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session,
    });

  } catch (err) {
    console.error("An unexpected error occurred during session initialization:", err);
    set({ session: null, user: null, isAuthenticated: false }); // Reset state on unexpected errors
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