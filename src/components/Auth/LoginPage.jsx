import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import apiClient from '../../api/apiClient';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // --- ADDED PROFILE SYNC LOGIC ---
      const collegeId = localStorage.getItem('collegeId'); // Get ID saved during registration

      if (collegeId) {
        try {
          await apiClient.post('/accounts/sync-profile/', { college_id: collegeId });
          console.log('User profile synced with backend successfully.');
        } catch (syncError) {
          console.error("Fatal: Failed to sync user profile.", syncError.response?.data || syncError.message);
          await supabase.auth.signOut();
          alert("Could not initialize your account profile. Please try logging in again.");
          setLoading(false);
          return;
        }
      } else {
        console.warn("No collegeId found in localStorage to sync profile.");
      }
      // --- END OF PROFILE SYNC LOGIC ---

      navigate('/');

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Login to your Account</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            placeholder="Email Address"
          />
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            placeholder="Password"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;