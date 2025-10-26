import { create } from "zustand";
import { supabase } from "../supabaseClient";

export const useAuthStore = create((set, get) => ({
  session: null,
  user: null,
  profile: null,
  loading: true,
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
    set({ loading: true });
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profile,error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      if(error){
        console.log("Error fetching profile:", error);
      }else{
        set({ session, user: session.user, profile });
      }
      await get().fetchFaceEnrollmentStatus();
    }
    set({ loading: false });
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
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
      set({ loading: false });
    }
  },

  // --- ADD THIS NEW FUNCTION ---
  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // You can add scopes here if needed, e.g., 'profile email'
          // By default, Supabase requests 'email'.
        },
      });

      if (error) throw error;
      
      // Note: signInWithOAuth redirects, so the app will reload.
      // The initializeSession function will handle fetching the
      // user and profile after the redirect.
      return { data };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { error };
    }
    // No finally block to set loading: false, as the page will redirect
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, session: null, error: null, isFaceEnrolled: false });
  },
  
  updateFaceEnrollmentStatus: (status) => {
    set({ isFaceEnrolled: status });
  }
}));

useAuthStore.getState().initializeSession();