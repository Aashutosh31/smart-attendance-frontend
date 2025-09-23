import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import { toast } from 'react-toastify'
import { KeyRound, Mail } from 'lucide-react'

// Simple Google Icon SVG
const GoogleIcon = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 48 48" {...props}>
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
    s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
    s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
    C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
    c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.089,5.571
    l6.19,5.238C42.011,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
)

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })
      if (error) throw error
      toast.success('Logged in successfully!')
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
      if (error) throw error
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white flex items-center justify-center relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl animate-pulse delay-2000"></div>

      {/* Card */}
      <div className="relative w-full max-w-md p-8 rounded-2xl border border-purple-500/30 bg-black/60 shadow-[0_0_25px_rgba(139,92,246,0.4)] backdrop-blur-xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-400">Sign in to access your dashboard</p>
        </div>

        {/* Google login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex justify-center items-center gap-2 px-4 py-3 rounded-lg border border-gray-600 bg-black/40 text-gray-200 hover:border-fuchsia-400 hover:shadow-[0_0_15px_rgba(244,114,182,0.4)] transition"
        >
          <GoogleIcon className="h-5 w-5" />
          <span className="font-medium">Sign in with Google</span>
        </button>

        <div className="flex items-center gap-3">
          <hr className="w-full border-gray-600" />
          <span className="px-2 text-sm text-gray-400">OR</span>
          <hr className="w-full border-gray-600" />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="peer w-full pl-10 pr-4 py-3 rounded-lg border border-purple-500/30 bg-black/60 text-white placeholder-gray-400 outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/50 transition"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 peer-focus:text-fuchsia-400 transition" />
          </div>

          <div className="relative">
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="peer w-full pl-10 pr-4 py-3 rounded-lg border border-purple-500/30 bg-black/60 text-white placeholder-gray-400 outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/50 transition"
            />
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 peer-focus:text-fuchsia-400 transition" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/30 hover:scale-[1.02] hover:shadow-fuchsia-500/50 transition disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don&apos;t have a college account?{' '}
          <Link to="/register-college" className="font-medium text-fuchsia-400 hover:underline">
            Register Now
          </Link>
        </p>
      </div>
    </main>
  )
}

export default LoginPage
