// src/components/Auth/CollegeRegistrationPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify'; // Use toast for better feedback

const CollegeRegistrationPage = () => {
  const [formData, setFormData] = useState({
    collegeName: '',
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Create the user in Supabase Authentication
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'admin',
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User registration failed, please try again.');

      const newUserId = authData.user.id;

      // Step 2: Create the college in the public table
      const { data: collegeData, error: collegeError } = await supabase
        .from('colleges')
        .insert({
          name: formData.collegeName,
          admin_id: newUserId,
        })
        .select()
        .single();

      if (collegeError) {
        // Cleanup: delete the orphaned user if college creation fails
        await supabase.auth.admin.deleteUser(newUserId);
        throw collegeError;
      }
      
      // --- THIS IS THE CRITICAL NEW STEP ---
      // Step 3: Update the admin user's metadata to include their new college ID
      const { error: updateUserError } = await supabase.auth.admin.updateUserById(
        newUserId,
        { user_metadata: { ...authData.user.user_metadata, college_id: collegeData.id } }
      );

      if (updateUserError) {
          // If this fails, we have an inconsistent state. It's complex to roll back,
          // so for now, we'll just log the error and inform the user.
          throw new Error("Failed to link admin user to the college. Please contact support.");
      }

      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');

    } catch (error) {
      console.error('Registration Error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ... JSX remains the same
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Register Your College</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <input
            name="collegeName"
            type="text"
            placeholder="College Name"
            required
            value={formData.collegeName}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
          <input
            name="fullName"
            type="text"
            placeholder="Your Full Name"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
          <input
            name="email"
            type="email"
            placeholder="Admin Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
           <input
            name="phoneNumber"
            type="tel"
            placeholder="Phone Number"
            required
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollegeRegistrationPage;