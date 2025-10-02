import { create } from "zustand";
import { supabase } from "../supabaseClient";

export const useAuthStore = create((set, get) => ({
  session: null,
  user: null,
  profile: null,
  loading: true,
  error: null,

  initializeSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (session) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (profileError) throw profileError;
        set({ session, user: session.user, profile });
      } else {
        set({ session: null, user: null, profile: null });
      }
    } catch (error) {
      set({ error: error.message });
      console.error("Error initializing session:", error.message);
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();
      if (profileError) throw profileError;

      set({ session: authData.session, user: authData.user, profile: profileData });
      return { user: authData.user };
    } catch (error) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, profile: null, session: null, error: null, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

// Initialize on app start
useAuthStore.getState().initializeSession();
