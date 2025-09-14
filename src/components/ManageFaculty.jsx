import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/AuthStore.jsx';
import { Plus, User, Fingerprint } from 'lucide-react';
import { toast } from 'react-toastify';

// --- Add Faculty Modal Component ---
const AddFacultyModal = ({ isOpen, onClose, onFacultyAdded, token }) => {
  const [formData, setFormData] = useState({ name: '', email: '', department: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Backend team needs to create this endpoint
      const response = await fetch('http://localhost:8000/api/admin/faculty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to add faculty member.');
      toast.success('Faculty member added successfully!');
      onFacultyAdded(); // Refresh the list and close modal
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


// A simple loading skeleton to improve user experience
const TableSkeleton = () => (
    <div className="animate-pulse p-4">
        <div className="h-12 bg-gray-200 rounded-md mb-2"></div>
        <div className="h-12 bg-gray-200 rounded-md mb-2"></div>
        <div className="h-12 bg-gray-200 rounded-md"></div>
    </div>
);

// --- Main ManageFacultyPage Component ---
const ManageFacultyPage = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = useAuthStore((state) => state.token);

  const fetchFaculty = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/admin/faculty', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Could not fetch faculty data. Is the backend server running?');
      }
      const data = await response.json();
      setFacultyList(data);
    } catch (error) {
      console.error("Failed to fetch faculty list:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, [token]);

  const handleEnrollFingerprint = (facultyId) => {
    toast.info(`Opening scanner to enroll faculty #${facultyId}...`);
    window.location.href = `attendtrack://scan?token=${token}&mode=enroll&userId=${facultyId}&userType=faculty`;
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
        token={token}
      />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Faculty</h2>
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
                      <div className="text-sm font-medium text-gray-900">{faculty.name}</div>
                      <div className="text-sm text-gray-500">{faculty.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculty.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(faculty.dateJoined).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEnrollFingerprint(faculty.id)}
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      >
                        <Fingerprint size={16} />
                        <span>Enroll Fingerprint</span>
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