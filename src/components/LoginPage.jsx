import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore.jsx';
import { toast } from 'react-toastify';
import { BookOpen, KeyRound } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }
      toast.success('Login Successful!');
      setTimeout(() => {
        loginAction(data.token, data.role);
      }, 1500);
    } catch (err) {
      toast.error(err.message);
      setIsLoading(false);
    }
  };

  return (
    // CHANGE #1: Add the 'gradient-bg' class for the animated background
    <div className="flex items-center justify-center min-h-screen gradient-bg">
      
      {/* CHANGE #2: Add transition classes for the floating effect */}
      <div className="w-full max-w-md p-8 space-y-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-2">
        
        <div className="text-center">
          <BookOpen className="w-12 h-12 mx-auto text-blue-600" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">AttendTrack</h1>
          <p className="mt-2 text-sm text-gray-600">Universal Login</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <label htmlFor="email" className="sr-only">Email address</label>
            {/* CHANGE #3: Add the 'input-glow' class to the input */}
            <input 
              id="email" type="email" required 
              className="w-full px-4 py-3 pl-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md transition-all duration-300 input-glow" 
              placeholder="Email address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3"><KeyRound className="w-5 h-5 text-gray-400" /></div>
          </div>
          <div className="relative">
            <label htmlFor="password" className="sr-only">Password</label>
            {/* CHANGE #4: Add the 'input-glow' class to the input */}
            <input 
              id="password" type="password" required 
              className="w-full px-4 py-3 pl-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md transition-all duration-300 input-glow" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3"><KeyRound className="w-5 h-5 text-gray-400" /></div>
          </div>
          <div>
            <button type="submit" disabled={isLoading} className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105">
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;