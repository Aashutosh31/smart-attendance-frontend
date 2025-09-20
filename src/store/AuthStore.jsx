import { create } from 'zustand';
import { supabase } from '../supabaseClient';

export const useAuthStore = create((set) => ({
  session: null,
  user: null,
  isAuthenticated: false,
  isVerified: false,
  collegeId: null, // Stores the logged-in user's college ID

  setSession: (session) => {
    const user = session?.user || null;
    set({ 
      session, 
      user, 
      isAuthenticated: !!session, 
      collegeId: user?.user_metadata?.college_id || null
    });
  },

  setAuthSession: (sessionData) => {
    supabase.auth.setSession(sessionData);
    const user = sessionData?.user || null;
    set({
      session: sessionData,
      user,
      isAuthenticated: !!sessionData,
      collegeId: user?.user_metadata?.college_id || null
    });
  },
  
  setVerified: () => set({ isVerified: true }),

  logout: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, isAuthenticated: false, isVerified: false, collegeId: null });
  },
}));

supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setSession(session);
});