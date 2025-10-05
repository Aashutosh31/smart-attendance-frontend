import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore.jsx';
import { User, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';

const TableSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-14 bg-gray-200 rounded-md mb-2"></div>
    <div className="h-14 bg-gray-200 rounded-md mb-2"></div>
    <div className="h-14 bg-gray-200 rounded-md mb-2"></div>
  </div>
);

const FacultyAttendancePage = () => {
  const [facultyAttendanceList, setFacultyAttendanceList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = useAuthStore((state) => state.session?.access_token);

  useEffect(() => {
    const fetchFacultyAttendance = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/hod/faculty-attendance/today`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setFacultyAttendanceList(data);
      } catch (error) {
        console.error("Failed to fetch faculty attendance:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFacultyAttendance();
  }, [token]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Faculty Attendance - Today</h2>
        {/* You can add filters here later, e.g., a date picker */}
      </div>

      <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan="4" className="p-4"><TableSkeleton /></td></tr>
              ) : (
                facultyAttendanceList.map((faculty) => (
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${faculty.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {faculty.status === 'present' ? <CheckCircle className="w-4 h-4 mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                        {faculty.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {faculty.checkInTime || 'N/A'}
                    </td>
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

export default FacultyAttendancePage;