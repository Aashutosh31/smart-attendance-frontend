import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/AuthStore.jsx';
import { UserPlus, KeyRound, Building, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient.js';

// Modal component for adding a new faculty member
const AddFacultyModal = ({ isOpen, onClose, onFacultyAdded }) => {
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

    const payload = {
      email: formData.email,
      password: formData.password,
      full_name: formData.fullName,
      department: formData.department,
      role: 'faculty', // Hardcode the role for this form
    };

    try {
      await apiClient.post('/api/accounts/create-user/', payload);
      toast.success('Faculty member added successfully!');
      onFacultyAdded(); // This will close the modal and refresh the list
    } catch (error) {
      toast.error(error.message || 'Failed to add faculty.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Faculty</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="relative">
            <input type="text" name="fullName" required placeholder="Full Name" onChange={handleChange} className="peer w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 peer-focus:text-yellow-500" />
          </div>
           {/* Email */}
          <div className="relative">
            <input type="email" name="email" required placeholder="Email Address" onChange={handleChange} className="peer w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 peer-focus:text-yellow-500" />
          </div>
          {/* Department */}
          <div className="relative">
             <input type="text" name="department" required placeholder="Department" onChange={handleChange} className="peer w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
             <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 peer-focus:text-yellow-500" />
          </div>
          {/* Password */}
          <div className="relative">
            <input type="password" name="password" required placeholder="Password" onChange={handleChange} className="peer w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 peer-focus:text-yellow-500" />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-yellow-300">
              {isLoading ? 'Saving...' : 'Save Faculty'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// Main component for the page
const ManageFacultyPage = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { collegeId } = useAuthStore();

  const fetchFaculty = useCallback(async () => {
    if (!collegeId) return;
    setIsLoading(true);
    try {
      const data = await apiClient.get(`/api/colleges/${collegeId}/users/?role=faculty`);
      setFacultyList(data);
    } catch (error) {
      toast.error("Could not fetch faculty list.");
    } finally {
      setIsLoading(false);
    }
  }, [collegeId]);

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  const handleFacultyAdded = () => {
    setIsModalOpen(false);
    fetchFaculty(); // Refresh the list after adding a new member
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
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
          <UserPlus size={18} />
          <span>Add New Faculty</span>
        </button>
      </div>
       
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
           <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {isLoading ? (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500">Loading faculty...</td></tr>
            ) : facultyList.length === 0 ? (
                <tr><td colSpan="4" className="p-4 text-center text-gray-500">No faculty members found.</td></tr>
            ) : (
              facultyList.map((faculty) => (
                <tr key={faculty.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{faculty.full_name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{faculty.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{faculty.department || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(faculty.date_joined).toLocaleDateString()}
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
    </div>
  );
};

export default ManageFacultyPage;