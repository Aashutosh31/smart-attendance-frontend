import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supabaseClient';

// Helper function to extract relevant data from the Supabase session
const mapSessionToState = (session) => {
  const user = session?.user || null;
  return {
    session,
    user,
    isAuthenticated: !!user,
    role: user?.user_metadata?.role || null,
    collegeId: user?.user_metadata?.college_id || null,
  };
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // --- STATE ---
      session: null,
      user: null,
      isAuthenticated: false,
      role: null,
      collegeId: null,
      // This is for faculty/HOD face verification, specific to a frontend session
      isVerified: false,

      // --- ACTIONS ---
      /**
       * Internal action to update the store's state based on a Supabase session.
       * Also resets verification status on logout.
       */
      _setSession: (session) => {
        const state = mapSessionToState(session);
        // If the user is logging out (session becomes null), reset isVerified
        if (!session) {
          state.isVerified = false;
        }
        set(state);
      },

      /**
       * Marks the current user as having completed face verification for this session.
       */
      setVerified: () => {
        if (get().isAuthenticated) {
          set({ isVerified: true });
        }
      },
      
      /**
       * Logs the user out by calling Supabase signOut.
       * The onAuthStateChange listener will automatically clear the session state.
       */
      logout: async () => {
        await supabase.auth.signOut();
        // State will be cleared by the listener below
      },

      /**
       * A convenience getter to easily access the auth token.
       */
      get token() {
        return get().session?.access_token ?? null;
      },
    }),
    {
      // The key for storing the auth data in localStorage
      name: 'auth-storage',
      // Only persist a subset of the state. We don't need to persist everything.
      // `isVerified` is session-specific and should not be persisted across browser closes.
      partialize: (state) => ({
        session: state.session,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
        collegeId: state.collegeId,
      }),
    }
  )
);

// --- INITIALIZATION & SYNC LOGIC ---

// 1. Get the initial session when the app loads
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.getState()._setSession(session);
});

// 2. Listen for any changes in the authentication state (login, logout, token refresh)
// This is the most important part: it keeps your app's state in sync with Supabase
supabase.auth.onAuthStateChange((_event, session) => {
  const currentState = useAuthStore.getState();
  
  // Prevent unnecessary re-renders if the session ID is the same
  if (session?.user?.id !== currentState.user?.id) {
    currentState._setSession(session);
  }
});