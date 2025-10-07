import { create } from 'zustand';
import { supabase } from '../supabaseClient';

export const useAuthStore = create((set, get) => ({
  session: null,
  user: null,
  profile: null,
  loading: false, // <-- THE FIX: Changed initial state from true to false
  error: null,
  isFaceEnrolled: false,

  fetchFaceEnrollmentStatus: async () => {
    const session = get().session;
    if (!session?.access_token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/auth/status`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const { isFaceEnrolled } = await response.json();
        set({ isFaceEnrolled });
      }
    } catch (error) {
      console.error("Failed to fetch face enrollment status:", error);
    }
  },

  initializeSession: async () => {
    // We don't set loading to true here to avoid the button showing "Signing In..." on page load
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      set({ session, user: session.user, profile });
      await get().fetchFaceEnrollmentStatus();
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null }); // Set loading to true ONLY when signIn is called
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
      set({ session: data.session, user: data.user, profile });
      await get().fetchFaceEnrollmentStatus();
      return { user: data.user };
    } catch (error) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ loading: false }); // Set loading back to false when done
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, session: null, error: null, isFaceEnrolled: false });
  },
  
  updateFaceEnrollmentStatus: (status) => {
    set({ isFaceEnrolled: status });
  }
}));

// Initialize the session when the app loads
useAuthStore.getState().initializeSession();

export default useAuthStore;