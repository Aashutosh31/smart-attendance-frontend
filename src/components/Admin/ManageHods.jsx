// src/components/Admin/ManageHods.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, KeyRound, Building, Trash2, Camera } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient.js'; // <-- Use apiClient
import { supabase } from '../../supabaseClient'; // Keep for fetching list

const AddHodModal = ({ isOpen, onClose, onHodAdded }) => {
  const [formData, setFormData] = useState({ fullName: '', email: '', department: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    setIsLoading(true);

    // This is the new payload for the Django API
    const payload = {
      email: formData.email,
      password: formData.password,
      full_name: formData.fullName,
      department: formData.department, // You can add department to your serializer if needed
      role: 'hod', // Hardcode the role
    };

    try {
      // Use the apiClient to call the Django endpoint
      await apiClient.post('/api/accounts/users/create/', payload);
      toast.success('HOD added successfully!');
      onHodAdded(); // This will close the modal and refresh the list
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setFormData({ fullName: '', email: '', department: '', password: '' }); // Reset form
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Add New HOD</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Inputs (Name, Email, Department, Password) go here */}
          {/* ... Ensure you have inputs for fullName, email, department, and password ... */}
           <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Adding...' : 'Add HOD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const ManageHods = () => {
  const [hodList, setHodList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchHods = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('accounts_userprofile')
        .select('*')
        .eq('role', 'hod');
      if (error) throw error;
      setHodList(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHods();
  }, [fetchHods]);
  
  const handleHodAdded = () => {
    setIsModalOpen(false);
    fetchHods(); // Refresh the list
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage HODs</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center space-x-2">
          <UserPlus size={18} />
          <span>Add HOD</span>
        </button>
      </div>
       <AddHodModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onHodAdded={handleHodAdded}
      />
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
               {/* Table Headers */}
            </thead>
           <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {isLoading ? (
              <tr><td colSpan="4" className="p-4 text-center">Loading HODs...</td></tr>
            ) : hodList.length === 0 ? (
                <tr><td colSpan="4" className="p-4 text-center text-gray-500">No HODs found.</td></tr>
            ) : (
              hodList.map((hod) => (
                <tr key={hod.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{hod.full_name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{hod.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{hod.department || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                     {hod.created_at ? new Date(hod.created_at).toLocaleDateString() : 'N/A'}
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

export default ManageHods;