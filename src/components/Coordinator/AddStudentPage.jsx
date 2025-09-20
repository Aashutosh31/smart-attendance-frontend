import React, { useState } from 'react';
import { useAuthStore } from '../../store/AuthStore.jsx';
import { toast } from 'react-toastify';
import { UserPlus, KeyRound } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const AddStudentPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    password: '',
    confirmPassword: '',
    department: '',
    branch: '',
    semester: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user, collegeId } = useAuthStore(); // Get collegeId from logged-in coordinator

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    // --- ADD THIS CHECK ---
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    // --- END OF ADDITION ---
    if (!collegeId) {
        toast.error("Cannot add student: Your account is not linked to a college.");
        return;
    }

    setIsLoading(true);
    try {
      // Step 1: Create the student user via the Edge Function
      const { data: authData, error: authError } = await supabase.functions.invoke('create-user', {
        body: {
          email: formData.email,
          password: formData.password,
          role: 'student',
          fullName: formData.name,
          collegeId: collegeId
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Could not create student user.");

      // Step 2: Get coordinator's year to assign to the student
      const { data: coordinatorProfile, error: coordinatorError } = await supabase
        .from('profiles')
        .select('year')
        .eq('id', user.id)
        .single();
      if (coordinatorError) throw coordinatorError;

      // Step 3: Update the student's new profile with specific details
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          roll_number: formData.rollNo,
          department: formData.department,
          branch: formData.branch,
          semester: formData.semester,
          year: coordinatorProfile.year,
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      toast.success('Student added successfully!');
      setFormData({ name: '', email: '', rollNo: '', password: '', confirmPassword: '', department: '', branch: '', semester: '' });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Add New Student</h2>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
            <div>
              <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Roll Number</label>
              <input type="text" name="rollNo" id="rollNo" required value={formData.rollNo} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full input-style" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
              <input type="text" name="department" id="department" required value={formData.department} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
             <div>
              <label htmlFor="branch" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Branch</label>
              <input type="text" name="branch" id="branch" required value={formData.branch} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Semester</label>
              <input type="number" name="semester" id="semester" required value={formData.semester} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <input type="password" name="password" required value={formData.password} onChange={handleChange} className="mt-1 block w-full pl-10 input-style" />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3"><KeyRound className="w-5 h-5 text-gray-400" /></div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
              <div className="relative">
                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="mt-1 block w-full pl-10 input-style" />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3"><KeyRound className="w-5 h-5 text-gray-400" /></div>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 disabled:bg-blue-400">
              <UserPlus size={18} />
              <span>{isLoading ? 'Adding Student...' : 'Add Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentPage;