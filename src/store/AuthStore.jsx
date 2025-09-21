import create from 'zustand'

/**
 * Auth store (Zustand)
 * - Exposes: useAuthStore (named + default export)
 * - Safe for build/SSR: guards window/localStorage access
 * - Uses VITE_API_HOST (fallback to http://localhost:8000)
 *
 * State shape:
 * {
 *   accessToken: string|null,
 *   user: object|null,
 *   role: string|null,
 *   isVerified: boolean,
 *   apiHost: string,
 *   ...helpers
 * }
 */

const DEFAULT_API_HOST = (typeof import !== 'undefined' && import.meta && import.meta.env && import.meta.env.VITE_API_HOST)
  ? import.meta.env.VITE_API_HOST
  : 'http://localhost:8000'

const safeRead = (key, parse = false) => {
  if (typeof window === 'undefined') return null
  try {
    const v = localStorage.getItem(key)
    if (v === null || v === undefined) return null
    return parse ? JSON.parse(v) : v
  } catch (e) {
    // fail silently in build/SSR
    return null
  }
}

const safeWrite = (key, value) => {
  if (typeof window === 'undefined') return
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key)
    } else if (typeof value === 'string') {
      localStorage.setItem(key, value)
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  } catch (e) {
    // ignore write errors (e.g., storage disabled)
  }
}

export const useAuthStore = create((set, get) => ({
  accessToken: safeRead('token', false),
  user: safeRead('user', true),
  role: safeRead('role', false) || (safeRead('user', true)?.role || null),
  isVerified: !!(safeRead('isVerified', false) || (safeRead('user', true)?.isVerified)),
  apiHost: DEFAULT_API_HOST,

  // Setters
  setToken: (token) => {
    safeWrite('token', token)
    set({ accessToken: token })
  },

  setUser: (user) => {
    safeWrite('user', user)
    // keep role & isVerified in sync
    const role = user && user.role ? user.role : null
    const isVerified = !!(user && user.isVerified)
    safeWrite('role', role)
    safeWrite('isVerified', isVerified)
    set({ user, role, isVerified })
  },

  setRole: (role) => {
    safeWrite('role', role)
    set({ role })
  },

  setVerified: (val = true) => {
    safeWrite('isVerified', !!val)
    set({ isVerified: !!val })
  },

  logout: (redirectTo = '/login') => {
    safeWrite('token', null)
    safeWrite('user', null)
    safeWrite('role', null)
    safeWrite('isVerified', null)
    set({ accessToken: null, user: null, role: null, isVerified: false })
    if (typeof window !== 'undefined') {
      try {
        // replace so user can't go back to protected page
        window.location.replace(redirectTo)
      } catch (e) {
        // ignore in non-browser envs
      }
    }
  },

  // helpers
  isAuthenticated: () => {
    return !!get().accessToken
  },

  getAuthHeaders: (extra = {}) => {
    const t = get().accessToken
    const base = { 'Content-Type': 'application/json', ...extra }
    return t ? { Authorization: `Bearer ${t}`, ...base } : base
  },

  // build full API URL from path: '/api/whatever' or 'api/..'
  buildApiUrl: (path = '') => {
    const host = (get().apiHost || DEFAULT_API_HOST).toString().replace(/\/+$/, '')
    const p = String(path || '').replace(/^\/+/, '')
    return p ? `${host}/${p}` : host
  }
}))

export default useAuthStore