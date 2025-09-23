import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import { toast } from 'react-toastify'
import { KeyRound, Mail } from 'lucide-react'

// Simple Google Icon SVG
const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-500 to-violet-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>

      {/* Main card with moving border light */}
      <div className="w-full max-w-md snake-border-main">
        <div className="p-8 bg-slate-900 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-400 text-base">Sign in to access your dashboard</p>
          </div>

          {/* Google login with interactive glow effects */}
<div className="mb-6">
  <button
    onClick={handleGoogleLogin}
    className="
      relative w-full flex items-center justify-center gap-3 px-5 py-3.5 
      font-medium rounded-xl overflow-hidden
      bg-slate-900 backdrop-blur-md
      text-gray-200 dark:text-white
      border border-white shadow-[0_0_6px_rgba(255,255,255,0.4)]
      transition-all duration-300
      hover:shadow-[0_0_8px_3px_rgba(255,192,203,0.8)]
      active:shadow-[0_0_18px_3px_rgba(0,255,127,0.8)]
    "
  >
    <span className="relative flex items-center gap-3 z-10">
      {/* Google Original G Logo */}
      <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
        <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.4H272v95.4h147c-6.4 34.6-25.7 63.9-55 83.4l89 69.1c52.1-48 80.5-118.7 80.5-197.5z"/>
        <path fill="#34A853" d="M272 544.3c73.6 0 135.4-24.4 180.6-66.3l-89-69.1c-24.8 16.6-56.5 26.4-91.6 26.4-70 0-129.3-47.3-150.6-110.7l-92 71c41.5 81.5 126.2 148.7 243 148.7z"/>
        <path fill="#FBBC05" d="M121.4 324.6c-10.3-30.7-10.3-63.6 0-94.3l-92-71c-40.1 79.3-40.1 171.2 0 250.5l92-71z"/>
        <path fill="#EA4335" d="M272 107.7c39.9 0 75.7 13.8 104 40.7l78-78C407.4 24.8 345.6 0 272 0 155.2 0 70.5 67.2 29 148.7l92 71C142.7 155 202 107.7 272 107.7z"/>
      </svg>

      {/* Text styled like Google Sign-in */}
      <span className="text-[15px] font-semibold tracking-wide">
        Sign in with Google
      </span>
    </span>
  </button>
</div>



          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-slate-700/50"></div>
            <span className="px-4 text-slate-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-slate-700/50"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email input */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3.5 bg-transparent text-white placeholder-slate-500 rounded-lg border border-slate-700/60 focus:outline-none focus:border-slate-600/80 transition-all"
                required
              />
            </div>

            {/* Password input */}
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3.5 bg-transparent text-white placeholder-slate-500 rounded-lg border border-slate-700/60 focus:outline-none focus:border-slate-600/80 transition-all"
                required
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
            className="w-full px-4 py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/30 hover:scale-[1.02] hover:shadow-fuchsia-500/50 transition disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-400 text-sm">
            Don't have a college account?{' '}
            <Link to="/register-college" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
