// src/api/apiClient.js

import axios from 'axios';
import { useAuthStore } from '../store/AuthStore.jsx';

const apiClient = axios.create({
  // --- FIX: Pointing directly to the default Django server address ---
  baseURL: 'http://127.0.0.1:8000', // Your Django API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

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