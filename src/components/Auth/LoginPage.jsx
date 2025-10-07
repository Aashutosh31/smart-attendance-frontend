import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogIn, User, Lock, Eye, EyeOff, Sun, Moon } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Access signIn function and user state from the store
  const { signIn, user, loading, error, isFaceEnrolled } = useAuthStore();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error.message || "Failed to sign in. Please check your credentials.");
    } else {
      toast.success("Successfully logged in!");
    }
  };
  
  // Redirect based on user state and face enrollment status
  useEffect(() => {
    if (user) {
      if (!isFaceEnrolled) {
        navigate('/enroll-face');
      } else {
        navigate('/'); // Redirect to RoleBasedRedirect
      }
    }
  }, [user, isFaceEnrolled, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 p-4">
        {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-slate-800/50 rounded-full transition-colors backdrop-blur-sm"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="glass-card p-8 md:p-10 rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AttendTrack
            </h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2">Smart Attendance System Login</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 dark:bg-slate-800/50 border-2 border-transparent focus:border-purple-500 focus:ring-0 transition text-gray-800 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-400"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-lg bg-white/10 dark:bg-slate-800/50 border-2 border-transparent focus:border-purple-500 focus:ring-0 transition text-gray-800 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="mr-2 h-5 w-5" />
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {error && <p className="mt-4 text-center text-red-500">{error}</p>}
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Don't have an account with a college?{' '}
              <Link to="/register-college" className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300">
                Register your College
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;