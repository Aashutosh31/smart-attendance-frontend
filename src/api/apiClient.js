// src/api/apiClient.js

import axios from 'axios';
import useAuthStore from '../store/AuthStore'; // Assuming your Zustand store is here

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Your Django API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// THIS IS THE IMPORTANT PART
// This "interceptor" runs before every single request is sent.
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from your Zustand store
    const token = useAuthStore.getState().session?.access_token;

    if (token) {
      // If the token exists, add it to the 'Authorization' header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;