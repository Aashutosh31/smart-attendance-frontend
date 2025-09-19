import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/AuthStore.jsx';
import { Plus, User, Camera } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../../supabaseClient'; // Import supabase

// --- Updated AddFacultyModal to use Supabase Edge Function ---
const AddFacultyModal = ({ isOpen, onClose, onFacultyAdded }) => {
  const [formData, setFormData] = useState({ name: '', email: '', department: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Invoke the 'create-user' Edge Function
      //eslint-disable-next-line
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          email: formData.email,
          password: 'default-password-123', // Set a temporary default password
          role: 'faculty',
          fullName: formData.name,
        },
      });

      if (error) throw error;

      // You might want to insert faculty-specific details into another table here
      // e.g., supabase.from('faculty_details').insert({ user_id: data.user.id, department: formData.department });

      toast.success('Faculty member added successfully!');
      onFacultyAdded(); // This will close the modal and refresh the list
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Faculty</h2>
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
              {isLoading ? 'Saving...' : 'Save Faculty'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// The rest of ManageFacultyPage.jsx remains largely the same,
// just ensure fetchFaculty() fetches from your new Supabase tables.
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
  //eslint-disable-next-line
  const { session } = useAuthStore((state) => state);

  const fetchFaculty = useCallback(async () => {
    setIsLoading(true);
    try {
        // Example: Fetching from a 'profiles' view or table in Supabase
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
    fetchFaculty(); // Refresh the list after adding
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculty.department || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(faculty.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEnrollFace(faculty.id)}
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

export default ManageFacultyPage;