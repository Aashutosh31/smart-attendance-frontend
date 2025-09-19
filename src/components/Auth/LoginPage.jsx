import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore.jsx';
import { toast } from 'react-toastify';
import { BookOpen, KeyRound, Users } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('faculty');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Get the session, user, AND the new setAuthSession action from the store
  const { session, user, setAuthSession } = useAuthStore();

  useEffect(() => {
    if (session) {
      const userRole = user?.user_metadata?.role;
      if (userRole === 'admin') navigate('/admin');
      else if (userRole === 'hod') navigate('/hod/verify');
      else if (userRole === 'program_coordinator') navigate('/coordinator');
      else if (userRole === 'student') navigate('/student');
      else if (userRole === 'faculty') navigate('/verify');
      else navigate('/');
    }
  }, [session, user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      // --- CHANGE: Call our new Edge Function ---
      const { data, error } = await supabase.functions.invoke('login-with-role', {
        body: { email, password, role },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Manually set the session in our app
      setAuthSession(data);
      
      toast.success('Login Successful! Redirecting...');

    } catch (err) {
      toast.error(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });
    if(error) toast.error(error.message);
  };

  return (
    <div className="flex items-center justify-center min-h-screen gradient-bg">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl">
        <div className="text-center">
          <BookOpen className="w-12 h-12 mx-auto text-blue-600" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">AttendTrack</h1>
          <p className="mt-2 text-sm text-gray-600">Universal Login</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input id="email" type="email" required className="w-full px-4 py-3 pl-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3"><KeyRound className="w-5 h-5 text-gray-400" /></div>
          </div>
          <div className="relative">
            <input id="password" type="password" required className="w-full px-4 py-3 pl-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3"><KeyRound className="w-5 h-5 text-gray-400" /></div>
          </div>
          
          <div className="relative">
            <select 
              id="role" 
              required 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="w-full px-4 py-3 pl-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none"
            >
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
              <option value="hod">HOD</option>
              <option value="program_coordinator">Program Coordinator</option>
              <option value="admin">Admin</option>
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Users className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <button type="submit" disabled={isLoading} className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-sm text-gray-500">Or continue with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div>
          <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.35 6.53C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v8.51h12.8c-.57 3.01-2.2 5.59-4.7 7.37l7.85 6.09c4.6-4.24 7.47-10.46 7.47-17.42z"></path><path fill="#FBBC05" d="M10.91 28.39c-.5-1.52-.77-3.13-.77-4.79s.27-3.27.77-4.79l-8.35-6.53C.95 15.13 0 19.45 0 24s.95 8.87 2.56 11.94l8.35-6.55z"></path><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.85-6.09c-2.18 1.47-4.96 2.34-8.04 2.34-6.26 0-11.57-4.22-13.47-9.91l-8.35 6.53C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
            Sign in with Google
          </button>
        </div>

        <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
                New Institution?{' '}
                <Link to="/register-college" className="font-medium text-blue-600 hover:text-blue-500">
                    Register your College
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;