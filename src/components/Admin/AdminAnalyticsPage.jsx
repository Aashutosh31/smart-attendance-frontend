import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Activity,
  UserCheck,
  Building2,
  Calendar,
  Award,
  Zap,
  ArrowUp,
  ArrowDown,
  Eye,
  Download,
  RefreshCw,
  Filter,
  Sparkles
} from 'lucide-react';

const AdminAnalyticsPage = () => {
  // Add this to EVERY page component (AdminReportsPage, ManageHods, etc.)

const [darkMode, setDarkMode] = useState(() => 
  document.documentElement.classList.contains('dark')
);

// 🔥 Universal Dark Mode Listener - Add this useEffect to every page
useEffect(() => {
  const handleDarkModeChange = (event) => {
    setDarkMode(event.detail.darkMode);
  };

  window.addEventListener('darkModeChange', handleDarkModeChange);
  
  return () => {
    window.removeEventListener('darkModeChange', handleDarkModeChange);
  };
}, []);
  // 🔥 End Universal Dark Mode Listener

  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalFaculty: 0,
    totalHODs: 0,
    recentActivity: [],
    attendanceRate: 0,
    departmentStats: [],
    monthlyTrends: []
  });
  
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  // Listen for dark mode changes from parent component
  useEffect(() => {
    const handleDarkModeChange = (event) => {
      setDarkMode(event.detail.darkMode);
    };

    window.addEventListener('darkModeChange', handleDarkModeChange);
    
    return () => {
      window.removeEventListener('darkModeChange', handleDarkModeChange);
    };
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalytics({
        totalUsers: 450,
        totalStudents: 350,
        totalFaculty: 45,
        totalHODs: 12,
        attendanceRate: 87.5,
        departmentStats: [
          { dept: 'Computer Science', students: 120, faculty: 15, attendance: 92, trend: 5.2 },
          { dept: 'Mechanical', students: 98, faculty: 12, attendance: 85, trend: -2.1 },
          { dept: 'Electrical', students: 85, faculty: 10, attendance: 88, trend: 3.4 },
          { dept: 'Civil', students: 47, faculty: 8, attendance: 79, trend: 1.8 }
        ],
        monthlyTrends: [
          { month: 'Jan', students: 320, attendance: 85 },
          { month: 'Feb', students: 335, attendance: 87 },
          { month: 'Mar', students: 350, attendance: 88 }
        ],
        recentActivity: [
          { action: 'New student registered', time: '2 minutes ago', type: 'student' },
          { action: 'Faculty added to CS dept', time: '1 hour ago', type: 'faculty' },
          { action: 'HOD updated profile', time: '3 hours ago', type: 'hod' },
          { action: 'Attendance report generated', time: '5 hours ago', type: 'report' }
        ]
      });
      setLoading(false);
    };

    fetchAnalytics();
  }, [timeRange]);

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <div className={`relative group p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
      darkMode 
        ? 'bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50' 
        : 'bg-white/70 hover:bg-white/90 border border-slate-200/50'
    } backdrop-blur-sm shadow-xl hover:shadow-2xl`}>
      {/* Background Gradient */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${color}`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend > 0 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        
        <div>
          <h3 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white group-hover:text-white' : 'text-slate-900 group-hover:text-white'}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          <p className={`font-medium ${darkMode ? 'text-slate-300 group-hover:text-white/90' : 'text-slate-600 group-hover:text-white/90'}`}>
            {title}
          </p>
          {subtitle && (
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400 group-hover:text-white/70' : 'text-slate-500 group-hover:text-white/70'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`h-32 rounded-2xl ${darkMode ? 'bg-slate-700/50' : 'bg-slate-200/50'}`} />
        ))}
      </div>
    </div>
  );

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Analytics Dashboard
              </h1>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Overview of your institution's performance and metrics
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-4 py-2 rounded-xl border transition-colors duration-200 ${
              darkMode 
                ? 'bg-slate-800 border-slate-600 text-white' 
                : 'bg-white border-slate-300 text-slate-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
            darkMode 
              ? 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700' 
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          } border border-slate-200/50 dark:border-slate-600/50`}>
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <button className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 shadow-lg">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={analytics.totalUsers}
          icon={Users}
          color="from-blue-500 to-blue-600"
          trend={12.5}
          subtitle="Active accounts"
        />
        <StatCard
          title="Students"
          value={analytics.totalStudents}
          icon={GraduationCap}
          color="from-emerald-500 to-emerald-600"
          trend={8.2}
          subtitle="Enrolled students"
        />
        <StatCard
          title="Faculty"
          value={analytics.totalFaculty}
          icon={UserCheck}
          color="from-purple-500 to-purple-600"
          trend={3.1}
          subtitle="Teaching staff"
        />
        <StatCard
          title="Attendance Rate"
          value={`${analytics.attendanceRate}%`}
          icon={TrendingUp}
          color="from-orange-500 to-orange-600"
          trend={2.3}
          subtitle="Overall average"
        />
      </div>

      {/* Charts and Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department Statistics */}
        <div className={`lg:col-span-2 p-6 rounded-2xl transition-all duration-300 ${
          darkMode 
            ? 'bg-slate-800/50 border border-slate-700/50' 
            : 'bg-white/70 border border-slate-200/50'
        } backdrop-blur-sm shadow-xl`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Building2 className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Department Overview
              </h2>
            </div>
            <button className={`p-2 rounded-lg transition-colors duration-200 ${
              darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
            }`}>
              <Filter className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {analytics.departmentStats.map((dept, index) => (
              <div key={dept.dept} className={`group p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                darkMode ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'bg-slate-50/50 hover:bg-slate-100/50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                      index === 0 ? 'from-blue-400 to-blue-600' :
                      index === 1 ? 'from-emerald-400 to-emerald-600' :
                      index === 2 ? 'from-purple-400 to-purple-600' :
                      'from-orange-400 to-orange-600'
                    }`} />
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {dept.dept}
                    </h3>
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${
                    dept.trend > 0 ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {dept.trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    <span>{Math.abs(dept.trend)}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {dept.students}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Students
                    </p>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {dept.faculty}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Faculty
                    </p>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {dept.attendance}%
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Attendance
                    </p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-slate-600' : 'bg-slate-200'}`}>
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${
                        index === 0 ? 'from-blue-400 to-blue-600' :
                        index === 1 ? 'from-emerald-400 to-emerald-600' :
                        index === 2 ? 'from-purple-400 to-purple-600' :
                        'from-orange-400 to-orange-600'
                      } transition-all duration-1000`}
                      style={{ width: `${dept.attendance}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`p-6 rounded-2xl transition-all duration-300 ${
          darkMode 
            ? 'bg-slate-800/50 border border-slate-700/50' 
            : 'bg-white/70 border border-slate-200/50'
        } backdrop-blur-sm shadow-xl`}>
          <div className="flex items-center space-x-3 mb-6">
            <Activity className={`w-6 h-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Recent Activity
            </h2>
          </div>
          
          <div className="space-y-4">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className={`group flex items-start space-x-3 p-3 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                darkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50/50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'student' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  activity.type === 'faculty' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                  activity.type === 'hod' ? 'bg-purple-100 dark:bg-purple-900/30' :
                  'bg-orange-100 dark:bg-orange-900/30'
                }`}>
                  {activity.type === 'student' && <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  {activity.type === 'faculty' && <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  {activity.type === 'hod' && <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                  {activity.type === 'report' && <BarChart3 className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {activity.action}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {activity.time}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className={`p-1 rounded-full ${
                    darkMode ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
                  }`}>
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button className={`w-full mt-4 py-3 rounded-xl border-2 border-dashed transition-all duration-300 hover:scale-[1.02] ${
            darkMode 
              ? 'border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300' 
              : 'border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-600'
          }`}>
            View All Activity
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className={`p-6 rounded-2xl transition-all duration-300 ${
        darkMode 
          ? 'bg-slate-800/50 border border-slate-700/50' 
          : 'bg-white/70 border border-slate-200/50'
      } backdrop-blur-sm shadow-xl`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Zap className={`w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Quick Insights
            </h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`text-center p-4 rounded-xl ${
            darkMode ? 'bg-emerald-900/20 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'
          }`}>
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              +15%
            </h3>
            <p className={`${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
              Student Growth
            </p>
          </div>
          
          <div className={`text-center p-4 rounded-xl ${
            darkMode ? 'bg-blue-900/20 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
          }`}>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              98.5%
            </h3>
            <p className={`${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              System Uptime
            </p>
          </div>
          
          <div className={`text-center p-4 rounded-xl ${
            darkMode ? 'bg-purple-900/20 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'
          }`}>
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              4.9/5
            </h3>
            <p className={`${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
              User Satisfaction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
