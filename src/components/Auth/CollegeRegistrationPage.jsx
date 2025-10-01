// File Path: src/components/Auth/CollegeRegistrationPage.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Building2, KeyRound, Mail, User, Shield } from "lucide-react";
import { supabase } from "../../supabaseClient";

const CollegeRegistrationPage = () => {
  const [formData, setFormData] = useState({
    collegeName: "",
    collegeId: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters long!");
    }

    setLoading(true);

    try {
      // Step 1: Create admin user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'admin',
            // Don't set college_id yet - we'll create it after
          }
        }
      });

      if (authError) throw authError;

      // Step 2: Create college entry
      const { data: collegeData, error: collegeError } = await supabase
        .from('colleges')
        .insert({
          name: formData.collegeName,
          college_id_text: formData.collegeId,
          created_at: new Date().toISOString(),
          created_by: authData.user.id
        })
        .select()
        .single();

      if (collegeError) throw collegeError;

      // Step 3: Update admin profile with college_id
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          college_id: collegeData.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      toast.success('College and admin account created successfully!');
      toast.info('Please check your email to verify your account.');
      
      // Redirect to login
      navigate('/login');
      
    } catch (error) {
      console.error('Error creating admin:', error);
      
      if (error.code === '23505') {
        toast.error('College ID already exists. Please choose a different one.');
      } else {
        toast.error(error.message || 'Failed to create admin account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Register Your College</h2>
          <p className="mt-2 text-sm text-gray-600">Create an admin account for Smart Attendance</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {[
            { id: "collegeName", icon: Building2, placeholder: "College Name", type: "text", required: true },
            { id: "collegeId", icon: Shield, placeholder: "Unique College ID (e.g., IITB-01)", type: "text", required: true },
            { id: "fullName", icon: User, placeholder: "Admin's Full Name", type: "text", required: true },
            { id: "email", icon: Mail, placeholder: "Admin's Email Address", type: "email", required: true },
            { id: "password", icon: KeyRound, placeholder: "Password", type: "password", required: true },
            { id: "confirmPassword", icon: KeyRound, placeholder: "Confirm Password", type: "password", required: true },
          ].map(({ id, icon: Icon, placeholder, type, required }) => (
            <div key={id} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id={id}
                name={id}
                type={type}
                required={required}
                value={formData[id]}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder={placeholder}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Creating Account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollegeRegistrationPage;
