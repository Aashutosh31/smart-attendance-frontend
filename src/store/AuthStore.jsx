// File Path: src/store/AuthStore.jsx
import { create } from 'zustand';
import { supabase } from '../supabaseClient';

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: true, // App starts in a loading state to check for a session
  error: null,

  /**
   * Initializes the session on app startup.
   * CRITICAL FIX: Ensures loading is set to false in all code paths.
   */
  initializeSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (session) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select(`*`)
          .eq('id', session.user.id)
          .single();
        if (profileError) throw profileError;
        set({ session, user: session.user, profile });
      }
    } catch (error) {
      console.error("Error initializing session:", error.message);
      set({ error: error.message });
    } finally {
      // This 'finally' block GUARANTEES the loading state is turned off,
      // which fixes the "Signing In..." button bug on page load.
      set({ loading: false });
    }
  },

  /**
   * Handles user sign-in.
   * CRITICAL FIX: Ensures loading is set to false after the operation completes.
   */
  signIn: async (email, password, role) => {
    set({ loading: true, error: null });
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', authData.user.id)
        .single();
      
      if (profileError) throw new Error("Could not find your user profile.");

      if (profileData.role !== role) {
        await supabase.auth.signOut();
        throw new Error(`Login failed. You are not registered as a ${role}.`);
      }

      set({ session: authData.session, user: authData.user, profile: profileData });
      return { user: authData.user };

    } catch (error) {
      console.error("Sign-in error:", error.message);
      set({ error: error.message });
      // Return the error so the component knows the login failed
      return { error };
    } finally {
      // This 'finally' block GUARANTEES the loading state is turned off after login,
      // which fixes the infinite loading page after a successful sign-in.
      set({ loading: false });
    }
  },

  /**
   * Handles new college and admin registration.
   */
  signUpAdmin: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: {
            role: 'admin',
            full_name: formData.fullName,
            college_name: formData.collegeName,
            college_id_text: formData.collegeId,
        }},
      });
      if (error) throw error;
      return {};
    } catch (error) {
      set({ error: error.message });
      console.error("Sign-up error:", error.message);
      return { error };
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Handles user sign-out.
   */
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      // Reset the entire state on sign-out
      set({ user: null, profile: null, session: null, error: null, loading: false });
    } catch (error) {
      console.error("Sign-out error:", error.message);
      set({ error: error.message, loading: false });
    }
  },
}));

// Initialize the session as soon as the app loads
useAuthStore.getState().initializeSession();