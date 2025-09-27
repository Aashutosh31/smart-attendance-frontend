// File Path: src/store/AuthStore.jsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supabaseClient';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // --- STATE ---
      session: null,
      user: null,
      userProfile: null,
      collegeId: null, // <-- Add collegeId to the initial state
      isAuthenticated: false,
      isVerified: false,
      isLoadingProfile: true,
      profileError: null,

      // --- ACTIONS ---
      fetchUserProfile: async () => {
        const { user } = get();
        if (!user) {
          set({ userProfile: null, collegeId: null, isLoadingProfile: false });
          return;
        }
      
        set({ isLoadingProfile: true, profileError: null });

        try {
          const { data: profile, error } = await supabase
            .from('users')
            .select(`*`)
            .eq('id', user.id)
            .single();
      
          if (error) {
            console.error('Error fetching user profile:', error);
            set({ profileError: error.message, userProfile: null, collegeId: null });
            return;
          }
      
          if (profile) {
            // *** THE CRITICAL FIX IS HERE ***
            // Set the profile AND extract the college_id into its own state
            set({ 
              userProfile: profile, 
              collegeId: profile.college_id, // <-- Set collegeId
              profileError: null 
            });
          }
        } catch (error) {
          console.error('Critical error in fetchUserProfile:', error);
          set({ profileError: 'A critical error occurred.', userProfile: null, collegeId: null });
        } finally {
          set({ isLoadingProfile: false });
        }
      },

      _setSession: (session) => {
        const user = session?.user || null;
        set({
          session,
          user,
          isAuthenticated: !!user,
          isVerified: false, 
        });

        get().fetchUserProfile();
      },

      setVerified: () => {
        if (get().isAuthenticated) {
          set({ isVerified: true });
        }
      },
      
      logout: async () => {
        await supabase.auth.signOut();
        set({ 
          userProfile: null, 
          isVerified: false, 
          session: null, 
          user: null, 
          isAuthenticated: false,
          collegeId: null // <-- Clear collegeId on logout
        });
      },

      get token() {
        return get().session?.access_token ?? null;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ session: state.session }),
    }
  )
);

supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.getState()._setSession(session);
});

supabase.auth.onAuthStateChange((_event, session) => {
  const currentState = useAuthStore.getState();
  if (session?.user?.id !== currentState.user?.id) {
    currentState._setSession(session);
  }
});