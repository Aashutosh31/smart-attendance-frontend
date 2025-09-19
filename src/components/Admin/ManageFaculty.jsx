import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/AuthStore.jsx';
import { Plus, User, Camera, KeyRound } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../../supabaseClient';

const AddFacultyModal = ({ isOpen, onClose, onFacultyAdded }) => {
  const [formData, setFormData] = useState({ name: '', email: '', department: '', subject: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password Validation
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
      // 1. Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.functions.invoke('create-user', {
        body: {
          email: formData.email,
          password: formData.password,
          role: 'faculty',
          fullName: formData.name,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Could not create user.");

      // 2. Update their profile with the extra details
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          department: formData.department,
          subject: formData.subject
        })
        .eq('id', authData.user.id);
      
      if (profileError) throw profileError;

      toast.success('Faculty member added successfully!');
      onFacultyAdded();
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Faculty</h2>
        <div className="max-h-[70vh] overflow-y-auto pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="name" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            {/* --- NEW/UPDATED Fields --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input type="text" name="department" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input type="text" name="subject" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
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
            <div className="flex justify-end space-x-4 pt-4 sticky bottom-0 bg-white py-3">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
              <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                {isLoading ? 'Saving...' : 'Save Faculty'}
              </button>
            </div>
          </form>
        </div>
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

const ManageFacultyPage = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFaculty = useCallback(async () => {
    setIsLoading(true);
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'faculty');

        if (error) throw error;
        setFacultyList(data);
    } catch (error) {
      console.error("Failed to fetch faculty list:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  const handleEnrollFace = (facultyId) => {
    toast.info(`Please guide faculty member #${facultyId} to the verification page to enroll their face.`);
  };

  const handleFacultyAdded = () => {
    setIsModalOpen(false);
    fetchFaculty();
  };

  return (
    <div>
      <AddFacultyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFacultyAdded={handleFacultyAdded}
      />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Faculty</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
          <Plus size={18} />
          <span>Add New Faculty</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department & Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
           <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan="4"><TableSkeleton /></td></tr>
            ) : (
              facultyList.map((faculty) => (
                <tr key={faculty.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{faculty.full_name}</div>
                    <div className="text-sm text-gray-500">{faculty.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{faculty.department || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{faculty.subject || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(faculty.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEnrollFace(faculty.id)}
                      className="text-blue-600 hover:bg-blue-800 flex items-center space-x-1"
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

export default ManageFacultyPage;