import { useAuthStore } from '../store/AuthStore';

const BASE_URL = import.meta.env.VITE_API_HOST || 'http://localhost:8000';

class API {
  static async request(endpoint, options = {}) {
    const session = useAuthStore.getState().session;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const config = {
      ...options,
      headers,
    };

    // Auto stringify body if it's an object
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Attempt to parse JSON response safely
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (!response.ok) {
      const error = new Error(data?.message || 'API request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data; // Usually `{ success, message, data }` based on new backend standard
  }

  static get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  static post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  static put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  static delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export default API;
