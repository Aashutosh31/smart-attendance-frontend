import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore.jsx';
import { User, CheckCircle, XCircle } from 'lucide-react';

const TableSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-14 bg-gray-200 rounded-md mb-2"></div>
    <div className="h-14 bg-gray-200 rounded-md mb-2"></div>
    <div className="h-14 bg-gray-200 rounded-md mb-2"></div>
  </div>
);

const CoordinatorAttendancePage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0], // Default to today
    courseId: '', // Default to all courses
  });
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        // Build the URL with query parameters for filtering
        const queryParams = new URLSearchParams({
            date: filters.date,
            courseId: filters.courseId,
        }).toString();
        
        // Backend team needs to create this endpoint
        const response = await fetch(`import.meta.env.VITE_API_HOST/api/coordinator/attendance?${queryParams}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setAttendanceRecords(data);
      } catch (error) {
        console.error("Failed to fetch attendance records:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (filters.date) {
        fetchAttendance();
    }
  }, [token, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800  dark:text-white">View Student Attendance</h2>
      </div>

      {/* Filter Section */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
        <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" name="date" id="date" value={filters.date} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
            <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">Course</label>
            <select name="courseId" id="courseId" value={filters.courseId} onChange={handleFilterChange} className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm">
                <option value="">All Courses</option>
                <option value="1">Web Development (CS301)</option>
                <option value="2">Database Systems (CS302)</option>
            </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan="4" className="p-4"><TableSkeleton /></td></tr>
              ) : (
                attendanceRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{record.studentName}</div>
                          <div className="text-sm text-gray-500">{record.rollNo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.courseName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {record.status === 'present' ? <CheckCircle className="w-4 h-4 mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                            {record.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.checkInTime || 'N/A'}
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

export default CoordinatorAttendancePage;