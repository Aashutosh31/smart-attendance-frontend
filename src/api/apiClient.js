// src/api/apiClient.js
import { useAuthStore } from "../store/AuthStore"; // Import the auth store

const API_URL = "https://paradigmshiftershcc-django.vercel.app/api/accounts";

const apiClient = {
  registerCollege: async (formData) => {
    // This endpoint doesn't need a token, so it remains unchanged.
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
    // Get the token directly from the auth store's state
    const token = useAuthStore.getState().session?.access_token;

    if (!token) {
        throw new Error("Authentication token not found. Please log in.");
    }

    const response = await fetch(`${API_URL}/create-user/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Use the token from the store
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
    // Get the token directly from the auth store's state
    const token = useAuthStore.getState().session?.access_token;

    if (!token) {
        throw new Error("Authentication token not found. Please log in.");
    }

    const response = await fetch(`${API_URL}/me/`, {
        method: 'GET',
        headers: {
            // Use the token from the store
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