import { create } from 'zustand'

/**
 * Auth store (Zustand)
 * - Safe for SSR/build: guards window/localStorage access
 * - Uses VITE_API_HOST (fallback to http://localhost:8000)
 * - Exposes: accessToken, user, role, isVerified, apiHost, helpers
 */

const DEFAULT_API_HOST =
  typeof import.meta !== 'undefined' &&
  import.meta.env &&
  import.meta.env.VITE_API_HOST
    ? import.meta.env.VITE_API_HOST
    : 'http://localhost:8000'

const safeRead = (key, parse = false) => {
  if (typeof window === 'undefined') return null
  try {
    const v = window.localStorage.getItem(key)
    if (v === null || v === undefined) return null
    return parse ? JSON.parse(v) : v
  } catch {
    return null
  }
}

const safeWrite = (key, value) => {
  if (typeof window === 'undefined') return
  try {
    if (value === null || value === undefined) {
      window.localStorage.removeItem(key)
    } else if (typeof value === 'string') {
      window.localStorage.setItem(key, value)
    } else {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  } catch {
    // ignore
  }
}

const useAuthStore = create((set, get) => ({
  accessToken: safeRead('token', false),
  user: safeRead('user', true),
  role: safeRead('role', false) || (safeRead('user', true)?.role ?? null),
  isVerified: !!(safeRead('isVerified', false) || (safeRead('user', true)?.isVerified)),
  apiHost: DEFAULT_API_HOST,

  setToken: (token) => {
    safeWrite('token', token)
    set({ accessToken: token })
  },

  setUser: (user) => {
    safeWrite('user', user)
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
      window.location.replace(redirectTo)
    }
  },

  isAuthenticated: () => !!get().accessToken,

  getAuthHeaders: (extra = {}) => {
    const t = get().accessToken
    const base = { 'Content-Type': 'application/json', ...extra }
    return t ? { Authorization: `Bearer ${t}`, ...base } : base
  },

  buildApiUrl: (path = '') => {
    const host = (get().apiHost || DEFAULT_API_HOST).replace(/\/+$/, '')
    const p = String(path || '').replace(/^\/+/, '')
    return p ? `${host}/${p}` : host
  }
}))

export default useAuthStore