import { create } from "zustand";
import { supabase } from "../supabaseClient";

const normalizeRole = (role) => {
  if (!role) return "student";
  if (role === "program_coordinator") return "coordinator";
  return role;
};

const buildProfilePayload = (sessionUser) => {
  const metadata = sessionUser?.user_metadata || {};
  return {
    id: sessionUser.id,
    email: sessionUser.email,
    full_name: metadata.full_name || metadata.name || sessionUser.email,
    role: normalizeRole(metadata.role),
    college_id: metadata.college_id || null,
    department: metadata.department || null,
    course: metadata.course || null,
    roll_number: metadata.roll_number || metadata.enrollment_number || null,
    updated_at: new Date().toISOString(),
  };
};

const ensureProfileRow = async (sessionUser) => {
  const payload = buildProfilePayload(sessionUser);

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", sessionUser.id)
    .maybeSingle();

  if (profileRow) return profileRow;

  const { data: userRow } = await supabase
    .from("users")
    .select("*")
    .eq("id", sessionUser.id)
    .maybeSingle();

  if (userRow) {
    return {
      ...payload,
      ...userRow,
      role: normalizeRole(userRow.role),
    };
  }

  // Last-resort in-memory profile so app can continue until DB rows are created by trigger/backend sync.
  return {
    ...payload,
    is_face_verified: false,
  };
};

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
      let profile = null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        console.log("Error fetching profile:", error);
      } else {
        profile = data;
      }

      if (!profile) {
        try {
          profile = await ensureProfileRow(session.user);
        } catch (ensureError) {
          console.log("Error creating fallback profile:", ensureError);
        }
      }

      set({ session, user: session.user, profile });
      await get().fetchFaceEnrollmentStatus();
    }
    set({ loading: false });
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      let profile = null;
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();

      profile = profileData;

      if (!profile) {
        profile = await ensureProfileRow(data.user);
      }

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