// src/components/Admin/ManageCoordinators.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, KeyRound, Camera, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient.js'; // <-- Use apiClient
import { supabase } from '../../supabaseClient'; // Keep for fetching list

const AddCoordinatorModal = ({ isOpen, onClose, onCoordinatorAdded }) => {
  const [formData, setFormData] = useState({ fullName: '', email: '', course: '', year: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      course: formData.course,
      year: parseInt(formData.year, 10), // Ensure year is an integer
      role: 'program_coordinator',
    };

    try {
      // CORRECTED URL
      await apiClient.post('/api/accounts/users/create/', payload);
      toast.success('Program Coordinator added successfully!');
      onCoordinatorAdded();
    } catch (error) {
      toast.error(error.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      onClose();
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
        <div className="modal-content">
            <h2 className="text-2xl font-bold mb-4">Add New Coordinator</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="input-style" />
                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email" className="input-style" />
                <input type="text" name="course" required value={formData.course} onChange={handleChange} placeholder="Course (e.g., B.Tech CSE)" className="input-style" />
                <input type="number" name="year" required value={formData.year} onChange={handleChange} placeholder="Year (e.g., 1, 2, 3)" className="input-style" />
                <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Password" className="input-style" />
                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="input-style" />
                <div className="flex justify-end space-x-2 pt-4">
                    <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                    <button type="submit" disabled={isLoading} className="btn-primary">
                        {isLoading ? 'Adding...' : 'Add Coordinator'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};


const ManageCoordinators = () => {
  const [coordinatorList, setCoordinatorList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCoordinators = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('accounts_userprofile')
        .select('*')
        .eq('role', 'program_coordinator');
      if (error) throw error;
      setCoordinatorList(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoordinators();
  }, [fetchCoordinators]);

  const handleCoordinatorAdded = () => {
    setIsModalOpen(false);
    fetchCoordinators();
  }

  return (
    <div className="p-6">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Manage Program Coordinators</h1>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center space-x-2">
                <UserPlus size={18} />
                <span>Add Coordinator</span>
            </button>
        </div>
        <AddCoordinatorModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCoordinatorAdded={handleCoordinatorAdded}
        />
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                {/* Table Head */}
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {isLoading ? (
                        <tr><td colSpan="4" className="p-4 text-center">Loading...</td></tr>
                    ) : coordinatorList.length === 0 ? (
                        <tr><td colSpan="4" className="p-4 text-center text-gray-500">No coordinators found.</td></tr>
                    ) : (
                        coordinatorList.map((coordinator) => (
                            <tr key={coordinator.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{coordinator.full_name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{coordinator.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{coordinator.department || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {coordinator.created_at ? new Date(coordinator.created_at).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-red-600 hover:text-red-800 flex items-center space-x-1">
                                      <Trash2 size={16} />
                                      <span>Remove</span>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default ManageCoordinators;