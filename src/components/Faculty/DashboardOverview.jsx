import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX } from 'lucide-react';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
);

const DashboardOverview = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/analytics/overview');
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch overview data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOverviewData();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  const stats = [
    { title: 'Total Students', value: analytics?.totalStudents || '0', icon: Users, color: 'blue' },
    { title: 'Present Today', value: analytics?.presentToday || '0', icon: UserCheck, color: 'green' },
    { title: 'Absentees', value: analytics?.absentToday || '0', icon: UserX, color: 'red' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  stat.color === 'green' ? 'bg-green-100 text-green-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* You can add back the "Recent Courses" and "Today's Attendance" tables here if you want them on the overview */}
    </div>
  );
};

export default DashboardOverview;