import { create } from 'zustand';
import { supabase } from '../supabaseClient';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // --- STATE ---
      session: null,
      user: null,
      isAuthenticated: false,
      role: null,
      isVerified: false, 
      loading: true,

      // --- ACTIONS ---
      getSession: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        set({ session, user: session?.user ?? null, isAuthenticated: !!session });
        if (session?.user) {
          await get().fetchProfile(session.user.id);
        }
        set({ loading: false });
        return session;
      },

      setSession: (session) => {
        set({ session, user: session?.user ?? null, isAuthenticated: !!session });
        if (session?.user) {
          get().fetchProfile(session.user.id);
        }
      },

      signOut: async () => {
        await supabase.auth.signOut();
        set({ session: null, user: null, isAuthenticated: false, role: null, isVerified: false });
      },

      fetchProfile: async (userId) => {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, is_verified')
          .eq('id', userId)
          .single();

        if (data) {
          set({ role: data.role, isVerified: data.is_verified });
        }
        if (error) {
          console.error('Error fetching profile:', error);
        }
      },
    }),
    {
      name: 'auth-storage', 
      getStorage: () => localStorage, 
    }
  )
);