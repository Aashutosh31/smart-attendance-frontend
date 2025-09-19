import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/AuthStore.jsx';
import { UserPlus, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../../supabaseClient';

const AddCoordinatorModal = ({ isOpen, onClose, onCoordinatorAdded }) => {
  const [formData, setFormData] = useState({ name: '', email: '', department: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Call the same universal 'create-user' function with the 'program_coordinator' role
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          email: formData.email,
          password: 'default-password-123',
          role: 'program_coordinator',
          fullName: formData.name,
        },
      });

      if (error) throw error;
      toast.success('Program Coordinator added successfully!');
      onCoordinatorAdded();
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Coordinator</h2>
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
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
              {isLoading ? 'Saving...' : 'Save Coordinator'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageCoordinatorsPage = () => {
  const [coordinatorList, setCoordinatorList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCoordinators = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
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
  };

  return (
    <div>
      <AddCoordinatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCoordinatorAdded={handleCoordinatorAdded}
      />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Coordinators</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
          <UserPlus size={18} />
          <span>Add New Coordinator</span>
        </button>
      </div>
       {/* Table to display coordinators would go here */}
    </div>
  );
};

export default ManageCoordinatorsPage;