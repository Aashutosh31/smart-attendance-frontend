// File Path: src/components/Auth/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/AuthStore'; // Corrected Import

// Google Icon SVG
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
      <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.4H272v95.4h147c-6.4 34.6-25.7 63.9-55 83.4l89 69.1c52.1-48 80.5-118.7 80.5-197.5z"/>
      <path fill="#34A853" d="M272 544.3c73.6 0 135.4-24.4 180.6-66.3l-89-69.1c-24.8 16.6-56.5 26.4-91.6 26.4-70 0-129.3-47.3-150.6-110.7l-92 71c41.5 81.5 126.2 148.7 243 148.7z"/>
      <path fill="#FBBC05" d="M121.4 324.6c-10.3-30.7-10.3-63.6 0-94.3l-92-71c-40.1 79.3-40.1 171.2 0 250.5l92-71z"/>
      <path fill="#EA4335" d="M272 107.7c39.9 0 75.7 13.8 104 40.7l78-78C407.4 24.8 345.6 0 272 0 155.2 0 70.5 67.2 29 148.7l92 71C142.7 155 202 107.7 272 107.7z"/>
    </svg>
);

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: '' });
  const navigate = useNavigate();
  // Correctly get state and actions from the store
  const { signIn, loading } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.role) {
      return toast.error('Please select your role to continue.');
    }

    const { error } = await signIn(formData.email, formData.password, formData.role);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged in successfully!');
      navigate('/'); // This will be handled by RoleBasedRedirect
    }
  };

  // UI Code below is unchanged...
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Visual elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-500 to-violet-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>

      <div className="w-full max-w-md snake-border-main">
        <div className="p-8 bg-slate-900 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-400 text-base">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="email" name="email" placeholder="Email Address"
                value={formData.email} onChange={handleChange} required
                className="w-full pl-10 pr-4 py-3.5 bg-transparent text-white placeholder-slate-500 rounded-lg border border-slate-700/60 focus:outline-none focus:border-slate-600/80 transition-all"
              />
            </div>

            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="password" name="password" placeholder="Password"
                value={formData.password} onChange={handleChange} required
                className="w-full pl-10 pr-4 py-3.5 bg-transparent text-white placeholder-slate-500 rounded-lg border border-slate-700/60 focus:outline-none focus:border-slate-600/80 transition-all"
              />
            </div>
            
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
              <select
                name="role" value={formData.role} onChange={handleChange} required
                className="w-full pl-10 pr-4 py-3.5 bg-transparent text-white placeholder-slate-500 rounded-lg border border-slate-700/60 focus:outline-none focus:border-slate-600/80 transition-all appearance-none"
              >
                <option value="" disabled className="bg-slate-800">Select your role...</option>
                <option value="admin" className="bg-slate-800">Admin</option>
                <option value="hod" className="bg-slate-800">HOD</option>
                <option value="faculty" className="bg-slate-800">Faculty</option>
                <option value="coordinator" className="bg-slate-800">Program Coordinator</option>
                <option value="student" className="bg-slate-800">Student</option>
              </select>
            </div>

            <button
              type="submit" disabled={loading}
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
  );
};

export default LoginPage;