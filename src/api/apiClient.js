// src/api/apiClient.js
import { useAuthStore } from '../store/AuthStore';

// Get the backend URL from the environment file
const API_HOST = import.meta.env.VITE_API_HOST;

/**
 * A centralized API client that automatically handles authentication tokens.
 * @param {string} endpoint - The API endpoint to call (e.g., '/api/accounts/profile/').
 * @param {object} options - Optional fetch options (e.g., method, body).
 * @returns {Promise<any>} - The JSON response from the API.
 */
const apiClient = async (endpoint, options = {}) => {
  // Get the access token from our global auth store
  // IMPORTANT: We get the token directly from the Zustand store on each call.
  const token = useAuthStore.getState().token;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // If we have a token, add the Authorization header to the request
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Correctly construct the full URL
  const response = await fetch(`${API_HOST}${endpoint}`, {
    ...options,
    headers,
  });

  // If the response is not OK, try to parse the error and throw it
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unexpected error occurred' }));
    throw new Error(errorData.detail || errorData.message || 'API request failed');
  }

  // Handle successful responses that might not have a body (e.g., a 204 No Content from a DELETE request)
  if (response.status === 204) {
      return null;
  }

  // For any other successful response, parse and return the JSON body.
  return response.json();
};

// --- Add HTTP method helpers for convenience ---

apiClient.get = (endpoint, options = {}) => {
  return apiClient(endpoint, { ...options, method: 'GET' });
};

apiClient.post = (endpoint, body, options = {}) => {
  return apiClient(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
};

apiClient.put = (endpoint, body, options = {}) => {
  return apiClient(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
};

apiClient.delete = (endpoint, options = {}) => {
  return apiClient(endpoint, { ...options, method: 'DELETE' });
};


export default apiClient;