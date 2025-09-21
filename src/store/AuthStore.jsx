import create from 'zustand'

/**
 * Auth store (Zustand)
 * - Keeps token + user info
 * - Persists to localStorage
 * - Exposes helpers for auth headers and API host (uses VITE_API_HOST)
 *
 * Usage:
 * const { token, setToken, logout, getAuthHeaders, buildApiUrl } = useAuthStore()
 */

const DEFAULT_API_HOST = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_HOST
  ? import.meta.env.VITE_API_HOST
  : 'http://localhost:8000'

const useAuthStore = create((set, get) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') || null : null,
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('token', token)
      else localStorage.removeItem('token')
    }
    set({ token })
  },
  setUser: (user) => {
    if (typeof window !== 'undefined') {
      if (user) localStorage.setItem('user', JSON.stringify(user))
      else localStorage.removeItem('user')
    }
    set({ user })
  },
  logout: (redirectTo = '/login') => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    set({ token: null, user: null })
    // Redirect to login (safe for client-side)
    if (typeof window !== 'undefined') {
      try { window.location.href = redirectTo } catch (e) { /* ignore in SSR/tests */ }
    }
  },
  isAuthenticated: () => {
    const t = get().token
    return !!t
  },
  getAuthHeaders: () => {
    const t = get().token
    return t ? { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
  },
  // Returns base API host from Vite env (fallback to DEFAULT_API_HOST)
  apiHost: DEFAULT_API_HOST,
  // Helper to build full API URL: use buildApiUrl('/api/auth/..')
  buildApiUrl: (path = '') => {
    const host = get().apiHost || DEFAULT_API_HOST
    // Ensure no double slashes
    return `${host.replace(/\/+$/,'')}/${path.replace(/^\/+/,'')}`
  }
}))

export default useAuthStore