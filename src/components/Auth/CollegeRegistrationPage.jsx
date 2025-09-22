import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import { Building2, KeyRound, Mail, User, Shield } from 'lucide-react';

const CollegeRegistrationPage = () => {
  const [formData, setFormData] = useState({
    collegeName: '',
    collegeId: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('register-college-and-admin', {
        body: {
          collegeId: formData.collegeId,
          collegeName: formData.collegeName,
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        },
      });

      // --- THIS IS THE FIX FOR THE FRONTEND ERROR ---
      // We now check the error object returned by the invoke call itself.
      if (error) {
        // If the error is from the function's explicit response (e.g., "User already exists")
        if (data && data.error) {
          throw new Error(data.error);
        }
        // For all other errors (like a 500 server error)
        throw new Error(error.message);
      }
      
      toast.success('Registration successful! You can now log in.');
      navigate('/login');

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // The JSX for the form remains the same
  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
        <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-2xl">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Register Your College</h1>
                <p className="mt-2 text-sm text-gray-600">Create an admin account for AttendTrack</p>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <input name="collegeName" type="text" placeholder="College Name" required value={formData.collegeName} onChange={handleChange} className="peer w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                    </div>
                    <div className="relative">
                        <input name="collegeId" type="text" placeholder="Unique College ID (e.g., IITB-01)" required value={formData.collegeId} onChange={handleChange} className="peer w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                    </div>
                </div>
                <div className="relative">
                    <input name="fullName" type="text" placeholder="Admin's Full Name" required value={formData.fullName} onChange={handleChange} className="peer w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                </div>
                <div className="relative">
                    <input name="email" type="email" placeholder="Admin's Email Address" required value={formData.email} onChange={handleChange} className="peer w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                </div>
                <div className="relative">
                    <input name="password" type="password" placeholder="Password" required value={formData.password} onChange={handleChange} className="peer w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                </div>
                <div className="relative">
                    <input name="confirmPassword" type="password" placeholder="Confirm Password" required value={formData.confirmPassword} onChange={handleChange} className="peer w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                </div>
                <button type="submit" disabled={loading} className="w-full px-4 py-3 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors">
                    {loading ? 'Registering...' : 'Create Account'}
                </button>
            </form>
            <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:underline">
                    Sign In
                </Link>
            </p>
        </div>
    </div>
  );
};

export default CollegeRegistrationPage;