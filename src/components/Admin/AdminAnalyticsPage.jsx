import React, { useState, useEffect } from 'react';
import { BarChart3, Users, GraduationCap, TrendingUp, Activity } from 'lucide-react';

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalFaculty: 0,
    totalHODs: 0,
    recentActivity: []
  });

  useEffect(() => {
    // Fetch analytics data here
    setAnalytics({
      totalUsers: 450,
      totalStudents: 350,
      totalFaculty: 45,
      totalHODs: 12,
      recentActivity: [
        { action: 'New student registered', time: '2 minutes ago' },
        { action: 'Faculty added to CS dept', time: '1 hour ago' },
        { action: 'HOD updated profile', time: '3 hours ago' }
      ]
    });
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {trend && (
            <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +{trend}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
        </div>
        <p className="text-gray-600 dark:text-slate-400">
          Overview of your institution's performance and metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={analytics.totalUsers}
          icon={Users}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          trend={12}
        />
        <StatCard
          title="Students"
          value={analytics.totalStudents}
          icon={GraduationCap}
          color="bg-gradient-to-r from-green-500 to-green-600"
          trend={8}
        />
        <StatCard
          title="Faculty"
          value={analytics.totalFaculty}
          icon={Users}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          trend={15}
        />
        <StatCard
          title="HODs"
          value={analytics.totalHODs}
          icon={Users}
          color="bg-gradient-to-r from-pink-500 to-pink-600"
          trend={5}
        />
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="h-6 w-6 text-purple-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        <div className="space-y-3">
          {analytics.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/30 rounded-lg">
              <span className="text-gray-900 dark:text-white">{activity.action}</span>
              <span className="text-gray-500 dark:text-slate-400 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
