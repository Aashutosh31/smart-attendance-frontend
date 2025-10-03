// UI-only restyle of existing LoginPage.jsx; no logic, routes, or handlers changed [attached_file:19]

// File Path: src/components/Auth/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/AuthStore';

// Google Icon SVG (visual only)
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" aria-hidden="true">
    <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.4H272v95.4h147c-6.4 34.6-25.7 63.9-55 83.4l89 69.1c52.1-48 80.5-118.7 80.5-197.5z"/>
    <path fill="#34A853" d="M272 544.3c73.6 0 135.4-24.4 180.6-66.3l-89-69.1c-24.8 16.6-56.5 26.4-91.6 26.4-70 0-129.3-47.3-150.6-110.7l-92 71c41.5 81.5 126.2 148.7 243 148.7z"/>
    <path fill="#FBBC05" d="M121.4 324.6c-10.3-30.7-10.3-63.6 0-94.3l-92-71c-40.1 79.3-40.1 171.2 0 250.5l92-71z"/>
    <path fill="#EA4335" d="M272 107.7c39.9 0 75.7 13.8 104 40.7l78-78C407.4 24.8 345.6 0 272 0 155.2 0 70.5 67.2 29 148.7l92 71C142.7 155 202 107.7 272 107.7z"/>
  </svg>
);

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: '' });
  const navigate = useNavigate();
  const { signIn, loading } = useAuthStore(); // unchanged

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
      navigate('/'); // unchanged
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Ambient neon glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full blur-[90px] opacity-40"
           style={{ background: 'radial-gradient(60% 60% at 50% 50%, #ec4899 0%, rgba(236,72,153,0) 70%)' }} />
      <div className="pointer-events-none absolute -bottom-28 -right-28 w-80 h-80 rounded-full blur-[100px] opacity-30"
           style={{ background: 'radial-gradient(60% 60% at 50% 50%, #22d3ee 0%, rgba(34,211,238,0) 70%)' }} />

      {/* Card container */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="relative rounded-2xl border border-pink-500/25 bg-slate-900/70 backdrop-blur-xl shadow-[0_0_40px_rgba(236,72,153,0.25)]">
          {/* Orange diagonal accent layer (visual only) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,115,0,0.2) 0%, rgba(255,65,108,0.15) 35%, rgba(0,0,0,0) 36%)'
            }}
          />
          {/* Grid split: left form, right welcome */}
          <div className="relative grid md:grid-cols-5">
            {/* Left: Login form */}
            <div className="md:col-span-3 p-8 md:p-10 animation-slide-in-left">
              <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(236,72,153,0.7)]">
                Login
              </h1>
              <p className="text-slate-400 mb-8">Sign in to access your dashboard</p>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3.5 rounded-lg bg-black/70 text-pink-100 placeholder-pink-300/80 border border-pink-600/30 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition"
                  />
                </div>

                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3.5 rounded-lg bg-black/70 text-pink-100 placeholder-pink-300/80 border border-pink-600/30 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition"
                  />
                </div>

                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-fuchsia-400" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3.5 rounded-lg bg-black/70 text-fuchsia-100 border border-fuchsia-600/30 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 transition appearance-none"
                  >
                    <option value="" disabled className="bg-black/90">Different Roles...</option>
                    <option value="admin" className="bg-black/90">Admin</option>
                    <option value="hod" className="bg-black/90">HOD</option>
                    <option value="faculty" className="bg-black/90">Faculty</option>
                    <option value="coordinator" className="bg-black/90">Program Coordinator</option>
                    <option value="student" className="bg-black/90">Student</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 shadow-[0_8px_24px_rgba(236,72,153,0.45)] hover:shadow-[0_10px_30px_rgba(236,72,153,0.65)] hover:scale-[1.02] active:scale-[0.99] transition-transform"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold border border-pink-400/40 text-pink-200 bg-gradient-to-r from-white/10 via-pink-500/20 to-purple-500/10 hover:border-pink-300/60 transition"
                  aria-label="Sign In with Google"
                >
                  <GoogleIcon />
                  <span>Sign In with Google</span>
                </button>
              </form>

              <p className="text-center mt-8 text-pink-300">
                Don&apos;t have a college account?{' '}
                <Link to="/register-college" className="font-semibold text-fuchsia-300 underline underline-offset-4 hover:text-pink-200 transition">
                  Register Now
                </Link>
              </p>
            </div>

            {/* Right: Welcome panel (visual only) */}
            <aside className="hidden md:flex md:col-span-2 relative items-center justify-center px-6 py-10 animation-slide-in-right">
              <div
                className="absolute inset-0 rounded-r-2xl"
                style={{
                  background: 'linear-gradient(135deg,#f97316 0%,#ef4444 40%,#0b0f1a 41%)',
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 22% 100%)',
                  opacity: 0.22
                }}
              />
              <div className="relative max-w-xs text-right">
                <h2 className="text-3xl font-extrabold text-white drop-shadow-[0_0_14px_rgba(250,100,100,0.55)]">
                  WELCOME<br/>BACK!
                </h2>
                <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                  We are happy to have you with us again. If anything is needed, support is here to help.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Local CSS for subtle entrance animations (no state) */}
      <style>{`
        @keyframes slideInLeft { 
          0% { transform: translateX(-28px); opacity: 0; filter: blur(6px); }
          100% { transform: translateX(0); opacity: 1; filter: blur(0); }
        }
        @keyframes slideInRight { 
          0% { transform: translateX(28px); opacity: 0; filter: blur(6px); }
          100% { transform: translateX(0); opacity: 1; filter: blur(0); }
        }
        .animation-slide-in-left { animation: slideInLeft 700ms ease both; }
        .animation-slide-in-right { animation: slideInRight 700ms ease 120ms both; }
      `}</style>
    </div>
  );
};

export default LoginPage;
