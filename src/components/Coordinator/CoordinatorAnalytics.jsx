import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { toast } from 'react-toastify';
import { BarChart, Users, UserX, TrendingUp, AlertTriangle, Download } from 'lucide-react';

// Reusable components for UI consistency
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm font-medium ${color}`}>{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color.replace('text', 'bg').replace('-600', '-100')}`}>
        {Icon && <Icon className={`w-6 h-6 ${color}`} />}
      </div>
    </div>
  </div>
);

const ChartPlaceholder = ({ title }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">{title}</h4>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <BarChart className="w-12 h-12 text-gray-300" />
        </div>
    </div>
);

const CoordinatorAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // Backend team needs to create this endpoint
        const response = await fetch('http://localhost:8000/api/coordinator/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch analytics data.');
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [token]);
  
  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) return <div className="p-6  dark:text-white">Loading analytics...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800  dark:text-white">Coordinator Analytics</h2>
         <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2">
            <Download size={18} />
            <span>Export Reports</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Avg. Attendance Rate" value={`${analytics?.averageAttendance || 0}%`} icon={TrendingUp} color="text-green-600" />
        <StatCard title="Total Students" value={analytics?.totalStudents || 0} icon={Users} color="text-blue-600" />
        <StatCard title="At-Risk Students (<75%)" value={analytics?.atRiskStudentsCount || 0} icon={UserX} color="text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Attendance Trend (Semester)" />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 p-6 border-b">Students with Low Attendance</h4>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance %</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {analytics?.lowAttendanceStudents?.map(student => (
                            <tr key={student.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{student.name}</div>
                                    <div className="text-sm text-gray-500">{student.rollNo}</div>
                                </td>
                                <td className={`px-6 py-4 font-bold ${getAttendanceColor(student.attendancePercentage)}`}>
                                    {student.attendancePercentage}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorAnalytics;