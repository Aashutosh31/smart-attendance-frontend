import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Calendar,
  PieChart,
  Activity
} from 'lucide-react';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({
    attendanceData: [],
    coursePerformance: [],
    studentEngagement: 0,
    growthRate: 0
  });

  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    // Your existing fetch logic
    setAnalytics({
      attendanceData: [
        { course: 'CS101', attendance: 85 },
        { course: 'CS201', attendance: 92 },
        { course: 'CS301', attendance: 78 }
      ],
      coursePerformance: [
        { name: 'Mathematics', score: 88 },
        { name: 'Physics', score: 76 },
        { name: 'Computer Science', score: 94 }
      ],
      studentEngagement: 89,
      growthRate: 12
    });
    setLoading(false);
  };

  const MetricCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500 text-sm">+{trend}%</span>
            </div>
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
              <span>Loading analytics...</span>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-8 w-8 text-purple-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
            </div>
            <p className="text-gray-600 dark:text-slate-400">
              Insights and performance metrics for your courses
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeRange === 'week'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeRange === 'month'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Student Engagement"
          value={`${analytics.studentEngagement}%`}
          icon={Activity}
          trend={analytics.growthRate}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <MetricCard
          title="Course Completion"
          value="76%"
          icon={BookOpen}
          trend={8}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <MetricCard
          title="Average Attendance"
          value="85%"
          icon={Users}
          trend={5}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <MetricCard
          title="Performance Score"
          value="92"
          icon={TrendingUp}
          trend={15}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Attendance</h3>
          <div className="space-y-3">
            {analytics.attendanceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-slate-300">{item.course}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${item.attendance}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-10">{item.attendance}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Performance</h3>
          <div className="space-y-3">
            {analytics.coursePerformance.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-slate-300">{item.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-10">{item.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
