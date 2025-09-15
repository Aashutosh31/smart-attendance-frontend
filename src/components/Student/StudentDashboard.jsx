import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, CheckCircle, XCircle } from 'lucide-react';

const StudentDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { logout: logoutAction, token } = useAuthStore();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/student/me/attendance', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setAttendance(data);
      } catch (error) {
        console.error("Failed to fetch attendance", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendance();
  }, [token]);

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
          <div className="p-6 border-b border-gray-700"><h1 className="text-2xl font-bold">Student Portal</h1></div>
          <nav className="flex-1 mt-6">
            <ul className="space-y-2 px-4">
              <li>
                <a href="#" className="flex items-center p-3 rounded-lg bg-blue-600 text-white"><BookOpen className="w-5 h-5 mr-3" />My Attendance</a>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-700">
            <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-lg hover:bg-red-600"><LogOut className="w-5 h-5 mr-3" />Sign Out</button>
          </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Attendance Report</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr><td colSpan="3" className="text-center p-4">Loading...</td></tr>
                  ) : (
                    attendance.map(record => (
                      <tr key={record.id}>
                        <td className="px-6 py-4">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">{record.courseName}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {record.status === 'present' ? <CheckCircle className="w-4 h-4 mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;