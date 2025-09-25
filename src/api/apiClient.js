// src/api/apiClient.js
import { supabase } from "../supabaseClient";

const API_URL = "https://paradigmshiftershcc-django.vercel.app/api/accounts"; // Replace with your actual backend URL

const getSupabaseToken = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token;
};

const apiClient = {
  // This new function sends all registration data to your new backend endpoint
  registerCollege: async (formData) => {
    const response = await fetch(`${API_URL}/register-college/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to register college.");
    }
    return response.json();
  },

  createUser: async (userData) => {
    const token = await getSupabaseToken();
    const response = await fetch(`${API_URL}/create-user/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user.');
    }
    return response.json();
  },

  getCurrentUser: async () => {
    const token = await getSupabaseToken();
    const response = await fetch(`${API_URL}/me/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user data.');
    }
    return response.json();
  }
};

export default apiClient;