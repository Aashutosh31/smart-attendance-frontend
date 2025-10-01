// File Path: src/components/HOD/HodOverviewPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Activity,
  UserPlus2,
  Calendar,
  Award,
  Zap,
  ArrowUp,
  ArrowDown,
  Eye,
  Download,
  RefreshCw,
  Sparkles,
  ClipboardCheck,
  BarChart3
} from 'lucide-react';

const HodOverviewPage = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalCoordinators: 0,
    totalStudents: 0,
    pendingVerifications: 0,
    recentActivity: [],
    courseStats: [],
  });
  
  const [darkMode, setDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );
  const [loading, setLoading] = useState(true);

  // Listen for dark mode changes
  useEffect(() => {
    const handleDarkModeChange = (event) => {
      setDarkMode(event.detail.darkMode);
    };
    window.addEventListener('darkModeChange', handleDarkModeChange);
    return () => window.removeEventListener('darkModeChange', handleDarkModeChange);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalCourses: 12,
        totalCoordinators: 8,
        totalStudents: 245,
        pendingVerifications: 3,
        courseStats: [
          { course: 'Computer Networks', students: 45, coordinator: 'Dr. Smith', status: 'active' },
          { course: 'Data Structures', students: 52, coordinator: 'Prof. Johnson', status: 'active' },
          { course: 'Operating Systems', students: 38, coordinator: 'Dr. Davis', status: 'pending' },
          { course: 'Database Systems', students: 41, coordinator: 'Prof. Wilson', status: 'active' }
        ],
        recentActivity: [
          { action: 'New course "AI & ML" created', time: '2 hours ago', type: 'course' },
          { action: 'Coordinator assigned to "Web Development"', time: '4 hours ago', type: 'coordinator' },
          { action: 'Student verification approved', time: '6 hours ago', type: 'verification' },
          { action: 'Course report generated', time: '1 day ago', type: 'report' }
        ]
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <div className={`relative group p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
      darkMode 
        ? 'bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50' 
        : 'bg-white/70 hover:bg-white/90 border border-slate-200/50'
    } backdrop-blur-sm shadow-xl hover:shadow-2xl`}>
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

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`h-32 rounded-2xl ${darkMode ? 'bg-slate-700/50' : 'bg-slate-200/50'}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Department Overview
              </h1>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Monitor and manage your department's performance
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
            darkMode 
              ? 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700' 
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          } border border-slate-200/50 dark:border-slate-600/50`}>
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <button className="px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 shadow-lg">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={BookOpen}
          color="from-blue-500 to-blue-600"
          trend={15.3}
          subtitle="Active courses"
        />
        <StatCard
          title="Coordinators"
          value={stats.totalCoordinators}
          icon={UserPlus2}
          color="from-emerald-500 to-emerald-600"
          trend={8.7}
          subtitle="Course coordinators"
        />
        <StatCard
          title="Students"
          value={stats.totalStudents}
          icon={GraduationCap}
          color="from-purple-500 to-purple-600"
          trend={12.1}
          subtitle="Enrolled students"
        />
        <StatCard
          title="Pending Verifications"
          value={stats.pendingVerifications}
          icon={ClipboardCheck}
          color="from-orange-500 to-orange-600"
          trend={-25.4}
          subtitle="Awaiting approval"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Statistics */}
        <div className={`lg:col-span-2 p-6 rounded-2xl transition-all duration-300 ${
          darkMode 
            ? 'bg-slate-800/50 border border-slate-700/50' 
            : 'bg-white/70 border border-slate-200/50'
        } backdrop-blur-sm shadow-xl`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <BookOpen className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Course Statistics
              </h2>
            </div>
          </div>
          
          <div className="space-y-4">
            {stats.courseStats.map((course, index) => (
              <div key={course.course} className={`group p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                darkMode ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'bg-slate-50/50 hover:bg-slate-100/50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      course.status === 'active' ? 'bg-emerald-500' : 'bg-yellow-500'
                    }`} />
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {course.course}
                    </h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {course.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {course.students}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Students
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {course.coordinator}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Coordinator
                    </p>
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
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className={`group flex items-start space-x-3 p-3 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                darkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50/50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'course' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  activity.type === 'coordinator' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                  activity.type === 'verification' ? 'bg-purple-100 dark:bg-purple-900/30' :
                  'bg-orange-100 dark:bg-orange-900/30'
                }`}>
                  {activity.type === 'course' && <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  {activity.type === 'coordinator' && <UserPlus2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  {activity.type === 'verification' && <ClipboardCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
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

      {/* Quick Actions */}
      <div className={`p-6 rounded-2xl transition-all duration-300 ${
        darkMode 
          ? 'bg-slate-800/50 border border-slate-700/50' 
          : 'bg-white/70 border border-slate-200/50'
      } backdrop-blur-sm shadow-xl`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Zap className={`w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Quick Actions
            </h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Add New Course', icon: BookOpen, color: 'from-blue-500 to-blue-600', path: '/hod/courses' },
            { label: 'Assign Coordinator', icon: UserPlus2, color: 'from-emerald-500 to-emerald-600', path: '/hod/coordinators' },
            { label: 'View Reports', icon: BarChart3, color: 'from-purple-500 to-purple-600', path: '/hod/reports' },
            { label: 'Verify Students', icon: ClipboardCheck, color: 'from-orange-500 to-orange-600', path: '/hod/verification' }
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white hover:scale-105 transition-all duration-300 flex flex-col items-center space-y-2 shadow-lg`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HodOverviewPage;
