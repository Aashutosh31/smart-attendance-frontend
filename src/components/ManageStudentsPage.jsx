import React, { useState, useEffect,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore.jsx';
import { User, Camera, Plus } from 'lucide-react'; // Changed icon
import { toast } from 'react-toastify';

const TableSkeleton = () => (
    <div className="animate-pulse p-4">
        <div className="h-14 bg-gray-200 rounded-md mb-2"></div>
        <div className="h-14 bg-gray-200 rounded-md mb-2"></div>
        <div className="h-14 bg-gray-200 rounded-md mb-2"></div>
    </div>
);

const ManageStudentsPage = () => {
  const [studentList, setStudentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/admin/students', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
       if (!response.ok) {
        throw new Error('Could not fetch student data. Is the backend server running?');
      }
      const data = await response.json();
      setStudentList(data);
    } catch (error) {
      console.error("Failed to fetch student list:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // This function now gives instructions for the student mobile app.
  const handleEnrollFace = (studentId) => {
    toast.info(`Please instruct student #${studentId} to enroll their face using the AttendTrack mobile app.`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Students</h2>
        <button
          onClick={() => navigate('/coordinator/add-student')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
          <Plus size={18} />
          <span>Add New Student</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan="4"><TableSkeleton /></td></tr>
              ) : (
                studentList.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.rollNo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.courseName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{student.overallAttendance}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {/* Updated button */}
                      <button
                        onClick={() => handleEnrollFace(student.id)}
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

export default ManageStudentsPage;