import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Moon, 
  Sun,
  TrendingUp,
  Calendar,
  Award,
  Target,
  Clock,
  GraduationCap,
  BarChart3,
  User,
  Star,
  Zap,
  Trophy,
  Activity
} from 'lucide-react';

const StudentDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClasses: 0,
    presentCount: 0,
    absentCount: 0,
    attendancePercentage: 0,
    streak: 0,
    gpa: 0
  });
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();
  const { signOut, profile } = useAuthStore();
  const user = profile;

  // Get token from auth store if available
  const token = useAuthStore.getState().accessToken || useAuthStore.getState().token;

  // Handle theme toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // Using the correct API endpoint
        const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/student/me/attendance`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setAttendance(data);
          
          // Calculate stats
          const totalClasses = data.length;
          const presentCount = data.filter(record => record.status === 'present').length;
          const absentCount = totalClasses - presentCount;
          const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;
          
          // Calculate streak (consecutive present days)
          let streak = 0;
          for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].status === 'present') {
              streak++;
            } else {
              break;
            }
          }
          
          setStats({
            totalClasses,
            presentCount,
            absentCount,
            attendancePercentage,
            streak,
            gpa: 3.8 // Mock GPA - replace with real data
          });
        } else {
          throw new Error("Failed to fetch attendance");
        }
      } catch (error) {
        // Mock data for demo
        const mockData = [
          { id: 1, date: '2024-01-20', courseName: 'Advanced React', status: 'present' },
          { id: 2, date: '2024-01-19', courseName: 'Database Systems', status: 'present' },
          { id: 3, date: '2024-01-18', courseName: 'Machine Learning', status: 'absent' },
          { id: 4, date: '2024-01-17', courseName: 'Web Security', status: 'present' },
          { id: 5, date: '2024-01-16', courseName: 'Advanced React', status: 'present' },
        ];
        
        setAttendance(mockData);
        setStats({
          totalClasses: 5,
          presentCount: 4,
          absentCount: 1,
          attendancePercentage: 80,
          streak: 2,
          gpa: 9.8
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
    // eslint-disable-next-line
  }, []);

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  // Premium stat card component
  const PremiumStatCard = ({ title, value, subtitle, icon: Icon, gradient, percentage, trend }) => (
    <div className="group relative">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse`}></div>
      <div className="relative glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 border border-white/10 dark:border-slate-700/30">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <Icon className="w-full h-full text-current" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                <TrendingUp className={`h-4 w-4 ${trend < 0 ? 'rotate-180' : ''}`} />
                <span className="text-xs font-medium">{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-slate-400">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-slate-500">{subtitle}</p>
            )}
          </div>
          {percentage !== undefined && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Achievement badge component
  const AchievementBadge = ({ icon: Icon, title, description, unlocked = false }) => (
    <div className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
      unlocked 
        ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 shadow-lg' 
        : 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50'
    }`}>
      <div className={`inline-flex p-2 rounded-lg ${
        unlocked 
          ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' 
          : 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-slate-500'
      }`}>
        <Icon className="h-5 w-5" />
      </div>
      <h4 className={`text-sm font-semibold mt-2 ${
        unlocked 
          ? 'text-gray-900 dark:text-white' 
          : 'text-gray-500 dark:text-slate-500'
      }`}>
        {title}
      </h4>
      <p className={`text-xs mt-1 ${
        unlocked 
          ? 'text-gray-600 dark:text-slate-400' 
          : 'text-gray-400 dark:text-slate-600'
      }`}>
        {description}
      </p>
      {unlocked && (
        <div className="absolute -top-1 -right-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current animate-pulse" />
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-pink-600 rounded-full animate-spin animate-reverse"></div>
          </div>
          <p className="text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 glass-card border-b border-white/20 dark:border-slate-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Student Portal
                </h1>
              </div>
            </div>
            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/10 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.full_name?.charAt(0)?.toUpperCase() || 'S'}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300 hidden sm:block">
                  {user?.full_name || 'Student'}
                </span>
              </div>
              {/* Logout */}
              <button
                onClick={handleSignOut}
                className="p-2 text-red-500 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back, {user?.full_name?.split(' ')[0] || 'Student'}! 🎓
          </h2>
          <p className="text-lg text-gray-600 dark:text-slate-400">
            Here's your academic journey at a glance
          </p>
        </div>
        {/* Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PremiumStatCard
            title="Attendance Rate"
            value={`${stats.attendancePercentage}%`}
            subtitle={`${stats.presentCount}/${stats.totalClasses} classes`}
            icon={Target}
            gradient="from-emerald-500 to-teal-600"
            percentage={stats.attendancePercentage}
            trend={5}
          />
          <PremiumStatCard
            title="Current Streak"
            value={`${stats.streak} days`}
            subtitle="Keep it going!"
            icon={Zap}
            gradient="from-yellow-500 to-orange-600"
            trend={stats.streak > 0 ? 10 : -5}
          />
          <PremiumStatCard
            title="GPA"
            value={stats.gpa.toFixed(1)}
            subtitle="Out of 10.0"
            icon={Award}
            gradient="from-blue-500 to-indigo-600"
            percentage={(stats.gpa / 10.0) * 100}
            trend={2}
          />
          <PremiumStatCard
            title="Total Classes"
            value={stats.totalClasses}
            subtitle="This semester"
            icon={BookOpen}
            gradient="from-purple-500 to-pink-600"
            trend={15}
          />
        </div>
        {/* Quick Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Overview */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 rounded-2xl border border-white/10 dark:border-slate-700/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Attendance</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                  <Activity className="h-4 w-4" />
                  Last 5 records
                </div>
              </div>
              <div className="space-y-3">
                {attendance.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/30 rounded-xl hover:bg-white/70 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        record.status === 'present' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        {record.status === 'present' ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{record.courseName}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          {new Date(record.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      record.status === 'present'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    }`}>
                      {record.status === 'present' ? 'Present' : 'Absent'}
                    </div>
                  </div>
                ))}
                {attendance.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-slate-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No attendance records yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Achievements */}
          <div className="glass-card p-6 rounded-2xl border border-white/10 dark:border-slate-700/30">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Achievements</h3>
            <div className="space-y-4">
              <AchievementBadge
                icon={Trophy}
                title="Perfect Week"
                description="100% attendance for 7 days"
                unlocked={stats.streak >= 7}
              />
              <AchievementBadge
                icon={Star}
                title="High Achiever"
                description="80%+ attendance rate"
                unlocked={stats.attendancePercentage >= 80}
              />
              <AchievementBadge
                icon={Zap}
                title="Consistency King"
                description="5 day streak"
                unlocked={stats.streak >= 5}
              />
              <AchievementBadge
                icon={Target}
                title="Sharp Shooter"
                description="90%+ attendance rate"
                unlocked={stats.attendancePercentage >= 90}
              />
            </div>
          </div>
        </div>
        {/* Performance Overview */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 dark:border-slate-700/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Performance Overview</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
              <BarChart3 className="h-4 w-4" />
              This semester
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
              <div className="inline-flex p-3 bg-green-500 text-white rounded-xl mb-3">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h4 className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.presentCount}</h4>
              <p className="text-green-600 dark:text-green-400 font-medium">Classes Attended</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl">
              <div className="inline-flex p-3 bg-red-500 text-white rounded-xl mb-3">
                <XCircle className="h-6 w-6" />
              </div>
              <h4 className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.absentCount}</h4>
              <p className="text-red-600 dark:text-red-400 font-medium">Classes Missed</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
              <div className="inline-flex p-3 bg-blue-500 text-white rounded-xl mb-3">
                <Clock className="h-6 w-6" />
              </div>
              <h4 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.streak}</h4>
              <p className="text-blue-600 dark:text-blue-400 font-medium">Day Streak</p>
            </div>
          </div>
        </div>
      </div>
      {/* Floating action elements */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col gap-3">
          {/* Quick stats bubble */}
          <div className="glass-card p-3 rounded-xl border border-white/10 dark:border-slate-700/30 shadow-2xl">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-700 dark:text-slate-300">{stats.attendancePercentage}% attendance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;