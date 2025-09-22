// src/components/Coordinator/AddStudentPage.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { UserPlus, KeyRound } from 'lucide-react';
import apiClient from '../../api/apiClient'; // <-- Use apiClient

const AddStudentPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    rollNo: '', // This field may need to be added to your Django model/serializer
    password: '',
    confirmPassword: '',
    department: '',
    branch: '',
    semester: '',
  });
  const [isLoading, setIsLoading] = useState(false);

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
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    setIsLoading(true);

    const payload = {
      email: formData.email,
      password: formData.password,
      full_name: formData.fullName,
      // Add other relevant fields here that your serializer expects
      // e.g., department, branch, semester, roll_no
      role: 'student', // Hardcode the role
    };

    try {
      await apiClient.post('/api/accounts/users/create/', payload);
      toast.success('Student added successfully!');
      // Reset form after successful submission
      setFormData({ 
        fullName: '', email: '', rollNo: '', password: '', confirmPassword: '', 
        department: '', branch: '', semester: '' 
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to add student.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Student</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form inputs for student details */}
            {/* ... Ensure you have inputs for fullName, email, password, etc. ... */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="mt-1 block w-full input-style" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full input-style" />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} className="mt-1 block w-full input-style" />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                  <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="mt-1 block w-full input-style" />
                </div>
             </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isLoading} className="btn-primary flex items-center space-x-2">
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