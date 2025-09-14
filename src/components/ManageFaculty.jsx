import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/AuthStore.jsx';
import { Plus, User, MoreHorizontal } from 'lucide-react';

// A simple loading skeleton to improve user experience
const TableSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-12 bg-gray-200 rounded-md mb-2"></div>
    <div className="h-12 bg-gray-200 rounded-md mb-2"></div>
    <div className="h-12 bg-gray-200 rounded-md mb-2"></div>
    <div className="h-12 bg-gray-200 rounded-md"></div>
  </div>
);


const ManageFacultyPage = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchFaculty = async () => {
      setIsLoading(true);
      try {
        // Backend team needs to create this endpoint
        const response = await fetch('http://localhost:8000/api/admin/faculty', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setFacultyList(data);
      } catch (error) {
        console.error("Failed to fetch faculty list:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaculty();
  }, [token]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Faculty</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan="5" className="p-4"><TableSkeleton /></td></tr>
              ) : (
                facultyList.map((faculty) => (
                  <tr key={faculty.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                          <User className="text-gray-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{faculty.name}</div>
                          <div className="text-sm text-gray-500">{faculty.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{faculty.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculty.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(faculty.dateJoined).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal /></button>
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