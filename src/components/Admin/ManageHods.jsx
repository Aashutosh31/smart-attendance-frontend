import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/AuthStore.jsx';
import { UserPlus, User, KeyRound, Camera } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../../supabaseClient';

const AddHodModal = ({ isOpen, onClose, onHodAdded }) => {
  const [formData, setFormData] = useState({ name: '', email: '', department: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    try {
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          email: formData.email,
          password: formData.password,
          role: 'hod',
          fullName: formData.name,
        },
      });
      if (error) throw error;

      // Also insert department into the profiles table
      await supabase
        .from('profiles')
        .update({ department: formData.department })
        .eq('id', data.user.id);
        
      toast.success('HOD added successfully!');
      onHodAdded();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New HOD</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input type="text" name="department" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input type="password" name="password" required onChange={handleChange} className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md" />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3"><KeyRound className="w-5 h-5 text-gray-400" /></div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
             <div className="relative">
              <input type="password" name="confirmPassword" required onChange={handleChange} className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md" />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3"><KeyRound className="w-5 h-5 text-gray-400" /></div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
              {isLoading ? 'Saving...' : 'Save HOD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TableSkeleton = () => (
    <div className="animate-pulse p-4">
        <div className="h-12 bg-gray-200 rounded-md mb-2"></div>
        <div className="h-12 bg-gray-200 rounded-md mb-2"></div>
        <div className="h-12 bg-gray-200 rounded-md"></div>
    </div>
);

const ManageHodsPage = () => {
  const [hodList, setHodList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchHods = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
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
    fetchHods();
  };
  
  const handleEnrollFace = (hodId) => {
    toast.info(`Please guide HOD #${hodId} to the verification page to enroll their face.`);
  };

  return (
    <div>
      <AddHodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onHodAdded={handleHodAdded}
      />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage HODs</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
          <UserPlus size={18} />
          <span>Add New HOD</span>
        </button>
      </div>
      
      {/* --- NEW: Table to display HODs --- */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
           <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan="4"><TableSkeleton /></td></tr>
            ) : (
              hodList.map((hod) => (
                <tr key={hod.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{hod.full_name}</div>
                    <div className="text-sm text-gray-500">{hod.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hod.department || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(hod.created_at).toLocaleDateString() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEnrollFace(hod.id)}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <Camera size={16} />
                      <span>Enroll Face</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageHodsPage;