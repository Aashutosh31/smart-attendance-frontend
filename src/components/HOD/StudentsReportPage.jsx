import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore.jsx';
import { User, MoreHorizontal, Filter, Download } from 'lucide-react';

const TableSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-14 bg-gray-200 rounded-md mb-2"></div>
    <div className="h-14 bg-gray-200 rounded-md mb-2"></div>
    <div className="h-14 bg-gray-200 rounded-md mb-2"></div>
  </div>
);

const StudentReportsPage = () => {
  const [studentReports, setStudentReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchStudentReports = async () => {
      setIsLoading(true);
      try {
        // Backend team needs to create this endpoint for the HOD
        const response = await fetch('import.meta.env.VITE_API_HOST/api/hod/student-reports', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setStudentReports(data);
      } catch (error) {
        console.error("Failed to fetch student reports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudentReports();
  }, [token]);
  
  // Helper to determine color for attendance percentage
  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800  dark:text-white">Student Reports</h2>
        <div className="flex space-x-2">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
                <Filter size={18} />
                <span>Filter</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
                <Download size={18} />
                <span>Export</span>
            </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Absences</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan="5" className="p-4"><TableSkeleton /></td></tr>
              ) : (
                studentReports.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                          <User className="text-gray-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.rollNo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.courseName}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${getAttendanceColor(student.attendancePercentage)}`}>
                      {student.attendancePercentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.totalAbsences}</td>
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

export default StudentReportsPage;