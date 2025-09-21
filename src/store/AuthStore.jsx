import create from 'zustand'

/**
 * Safe Auth store for client + build environments.
 * - Avoids accessing window/localStorage during SSR/build.
 * - Uses VITE_API_HOST when available, falls back to http://localhost:8000
 * - Exposes helpers: setToken, setUser, logout, isAuthenticated, getAuthHeaders, buildApiUrl
 */

const DEFAULT_API_HOST =
  (typeof import !== 'undefined' &&
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_API_HOST) ||
  'http://localhost:8000'

const readLocal = (key, parseJson = false) => {
  if (typeof window === 'undefined') return null
  try {
    const v = localStorage.getItem(key)
    if (!v) return null
    return parseJson ? JSON.parse(v) : v
  } catch (e) {
    console.warn(`AuthStore: failed to read localStorage key "${key}"`, e)
    return null
  }
}

const writeLocal = (key, value) => {
  if (typeof window === 'undefined') return
  try {
    if (value === null || typeof value === 'undefined') localStorage.removeItem(key)
    else localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
  } catch (e) {
    console.warn(`AuthStore: failed to write localStorage key "${key}"`, e)
  }
}

const useAuthStore = create((set, get) => ({
  token: readLocal('token', false),
  user: readLocal('user', true),
  apiHost: DEFAULT_API_HOST,

  setToken: (token) => {
    writeLocal('token', token)
    set({ token })
  },

  setUser: (user) => {
    writeLocal('user', user)
    set({ user })
  },

  logout: (redirectTo = '/login') => {
    writeLocal('token', null)
    writeLocal('user', null)
    set({ token: null, user: null })
    if (typeof window !== 'undefined') {
      try {
        // use location.replace so back button doesn't retain protected page
        window.location.replace(redirectTo)
      } catch (e) {
        // ignore in non-browser environments
      }
    }
  },

  isAuthenticated: () => {
    const t = get().token
    return !!t
  },

  getAuthHeaders: (extra = {}) => {
    const t = get().token
    const base = { 'Content-Type': 'application/json', ...extra }
    return t ? { Authorization: `Bearer ${t}`, ...base } : base
  },

  // buildApiUrl('/api/whatever') -> "https://host/api/whatever"
  buildApiUrl: (path = '') => {
    const host = (get().apiHost || DEFAULT_API_HOST).toString()
    const h = host.replace(/\/+$/, '')
    const p = String(path).replace(/^\/+/, '')
    return p ? `${h}/${p}` : h
  }
}))

export default useAuthStore