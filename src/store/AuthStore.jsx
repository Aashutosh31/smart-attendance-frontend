import { create } from 'zustand';
import { supabase } from '../supabaseClient';

export const useAuthStore = create((set) => ({
  // State
  session: null,
  user: null,
  isAuthenticated: false,
  isVerified: false,

  // Actions
  setSession: (session) => {
    const user = session?.user || null;
    set({ 
      session, 
      user, 
      isAuthenticated: !!session, 
      isVerified: false 
    });
  },

  // --- NEW ACTION ---
  // Manually sets the session from our custom login function
  setAuthSession: (sessionData) => {
    supabase.auth.setSession(sessionData);
    const user = sessionData?.user || null;
    set({
      session: sessionData,
      user,
      isAuthenticated: !!sessionData,
      isVerified: false,
    });
  },
  
  setVerified: () => set({ isVerified: true }),

  logout: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, isAuthenticated: false, isVerified: false });
  },
}));

// The onAuthStateChange listener remains important for Google login, etc.
supabase.auth.onAuthStateChange((event, session) => {
  // We only set the session from the listener if it's not a manual sign-in
  if (event !== 'SIGNED_IN') {
    useAuthStore.getState().setSession(session);
  }
});