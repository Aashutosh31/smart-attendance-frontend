import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supabaseClient';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // --- STATE ---
      session: null,
      user: null, // Holds the raw Supabase auth user object
      userProfile: null, // Holds profile data from our public 'users' table
      isAuthenticated: false,
      isVerified: false, // Session-based verification status (for faculty/student)

      // --- ACTIONS ---
      fetchUserProfile: async () => {
        const { user } = get();
        if (!user) {
          set({ userProfile: null }); // Clear profile on logout
          return;
        }
      
        try {
          // This call was causing the recursion. With the new RLS policy, it will now succeed.
          const { data: profile, error } = await supabase
            .from('users')
            .select(`*`)
            .eq('id', user.id)
            .single();
      
          if (error) {
            // This error will no longer be 'infinite recursion' after the SQL fix.
            console.error('Error fetching user profile:', error);
            // On failure, sign the user out to prevent being stuck in a bad state.
            get().logout();
            return;
          }
      
          if (profile) {
            set({ userProfile: profile });
          }
        } catch (error) {
          console.error('Critical error in fetchUserProfile:', error);
          set({ userProfile: null });
        }
      },

      // This internal function is called when Supabase auth state changes.
      _setSession: (session) => {
        const user = session?.user || null;
        set({
          session,
          user,
          isAuthenticated: !!user,
          // Reset session-specific verification on any auth change (login/logout)
          isVerified: false, 
        });

        // After setting the session, always try to fetch the detailed user profile.
        // This is the key to resolving the loading screen issue.
        get().fetchUserProfile();
      },

      // This is called by the verification pages. It's temporary for the session.
      setVerified: () => {
        if (get().isAuthenticated) {
          set({ isVerified: true });
        }
      },
      
      logout: async () => {
        await supabase.auth.signOut();
        // The onAuthStateChange listener will handle clearing the state via _setSession(null).
        set({ userProfile: null, isVerified: false });
      },

      // Convenience getter for the JWT.
      get token() {
        return get().session?.access_token ?? null;
      },
    }),
    {
      name: 'auth-storage',
      // Only persist the session object. Everything else is derived or fetched.
      partialize: (state) => ({
        session: state.session,
      }),
    }
  )
);

// --- INITIALIZATION & SYNC LOGIC ---
// This runs once when the app starts.
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.getState()._setSession(session);
});

// This listener keeps the app state in sync with Supabase auth events (login, logout, token refresh).
supabase.auth.onAuthStateChange((_event, session) => {
  const currentState = useAuthStore.getState();
  // Prevent unnecessary updates if the user hasn't actually changed.
  if (session?.user?.id !== currentState.user?.id) {
    currentState._setSession(session);
  }
});

