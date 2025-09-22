// src/components/Coordinator/AddStudentPage.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { UserPlus } from 'lucide-react';
import apiClient from '../../api/apiClient';

const AddStudentPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    semester: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    setIsLoading(true);

    const payload = {
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirmPassword,
      full_name: formData.fullName,
      semester: parseInt(formData.semester, 10),
      role: 'student',
    };

    try {
      // CORRECTED URL
      await apiClient.post('/api/accounts/users/create/', payload);
      toast.success('Student added successfully!');
      setFormData({ fullName: '', email: '', semester: '', password: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add student.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto card p-8">
        <h1 className="text-2xl font-bold mb-6">Add New Student</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="input-style" />
                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email" className="input-style" />
                <input type="number" name="semester" required value={formData.semester} onChange={handleChange} placeholder="Semester (e.g., 1, 2)" className="input-style" />
                <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Password" className="input-style" />
                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="input-style" />
            </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isLoading} className="btn-primary">
              <UserPlus size={18} className="mr-2"/>
              {isLoading ? 'Adding Student...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentPage;