import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    attendanceRate: 0,
    upcomingClasses: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      // Your existing API logic here
      setStats({
        totalStudents: 156,
        totalCourses: 8,
        attendanceRate: 87,
        upcomingClasses: 3
      });

      setRecentActivities([
        { id: 1, activity: 'New student enrolled', time: '2 hours ago', type: 'student' },
        { id: 2, activity: 'Attendance marked for CS101', time: '4 hours ago', type: 'attendance' },
        { id: 3, activity: 'Course material updated', time: '1 day ago', type: 'course' }
      ]);

      setLoading(false);
    };

    fetchData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
              <span>Loading dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
        </div>
        <p className="text-gray-600 dark:text-slate-400">
          Welcome back! Here's what's happening with your courses today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          description="Enrolled students"
        />
        
        <StatCard
          title="Active Courses"
          value={stats.totalCourses}
          icon={BookOpen}
          color="bg-gradient-to-r from-green-500 to-green-600"
          description="This semester"
        />
        
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon={CheckCircle}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          description="Last 30 days"
        />
        
        <StatCard
          title="Upcoming Classes"
          value={stats.upcomingClasses}
          icon={Clock}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          description="This week"
        />
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/30 rounded-lg">
              <div className="flex-shrink-0">
                {activity.type === 'student' && <Users className="h-4 w-4 text-blue-500" />}
                {activity.type === 'attendance' && <CheckCircle className="h-4 w-4 text-green-500" />}
                {activity.type === 'course' && <BookOpen className="h-4 w-4 text-purple-500" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">{activity.activity}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
