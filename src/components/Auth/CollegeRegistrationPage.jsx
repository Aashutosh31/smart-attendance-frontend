import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Shield, Mail, KeyRound } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const CollegeRegistrationPage = () => {
  const [collegeName, setCollegeName] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // --- NEW STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // --- NEW VALIDATION ---
    if (adminPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return; // Stop the submission
    }

    setIsLoading(true);
    toast.info('Registering College...');

    try {
      // The rest of your Supabase logic remains the same
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          data: {
            full_name: 'Admin',
            role: 'admin',
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Registration failed, please try again.");

      const { error: collegeError } = await supabase
        .from('colleges')
        .insert({
          id: collegeId,
          name: collegeName,
          admin_id: authData.user.id,
        });
      
      if (collegeError) throw collegeError;

      toast.success('Registration Successful! Please check your email to verify your account.');
      navigate('/login');

    } catch (err) {
      toast.error(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen gradient-bg">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto text-blue-600" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">College Registration</h1>
          <p className="mt-2 text-sm text-gray-600">Register your institution and create the main admin account.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input id="collegeName" type="text" required className="w-full px-4 py-3 pl-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" placeholder="College Name" value={collegeName} onChange={(e) => setCollegeName(e.target.value)} />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3"><Shield className="w-5 h-5 text-gray-400" /></div>
          </div>
          <div className="relative">
            <input id="collegeId" type="text" required className="w-full px-4 py-3 pl-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" placeholder="Unique College ID" value={collegeId} onChange={(e) => setCollegeId(e.target.value)} />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3"><Shield className="w-5 h-5 text-gray-400" /></div>
          </div>
          <div className="relative">
            <input id="adminEmail" type="email" required className="w-full px-4 py-3 pl-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" placeholder="Admin Email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3"><Mail className="w-5 h-5 text-gray-400" /></div>
          </div>
          <div className="relative">
            <input id="adminPassword" type="password" required className="w-full px-4 py-3 pl-10 text-gray-900 placeholder-gray-500 border border-ray-300 rounded-md" placeholder="Admin Password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3"><KeyRound className="w-5 h-5 text-gray-400" /></div>
          </div>
          {/* --- NEW CONFIRM PASSWORD FIELD --- */}
          <div className="relative">
            <input id="confirmPassword" type="password" required className="w-full px-4 py-3 pl-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" placeholder="Confirm Admin Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3"><KeyRound className="w-5 h-5 text-gray-400" /></div>
          </div>
          <div>
            <button type="submit" disabled={isLoading} className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
              {isLoading ? 'Registering...' : 'Register College'}
            </button>
          </div>
        </form>
         <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Go to Universal Login
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default CollegeRegistrationPage;