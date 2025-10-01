// File Path: src/components/HOD/HodDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Users, 
  UserCheck, 
  BookOpen, 
  LogOut, 
  Settings, 
  Sun, 
  Moon, 
  Bell, 
  UserCircle,
  Menu,
  X,
  ChevronRight,
  Crown,
  Sparkles,
  GraduationCap,
  UserPlus2,
  ClipboardCheck,
  TrendingUp,
  Calendar,
  User2Icon,
  Settings2,
  SettingsIcon
} from 'lucide-react';
import { useAuthStore } from '../../store/AuthStore';

const HodDashboard = () => {
  const { signOut, profile } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(5);

  // Apply dark mode immediately on mount and changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Dispatch custom event for child components
    window.dispatchEvent(new CustomEvent('darkModeChange', { detail: { darkMode } }));
  }, [darkMode]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const navLinks = [
    {icon:User2Icon, text:'Faculty Attendance',path:'/hod/faculty-attendance',color:'from-yellow-500 to-amber-500'},
    { icon: LayoutDashboard, text: 'Overview', path: '/hod/overview', color: 'from-blue-500 to-cyan-500' },
    { icon: BookOpen, text: 'Manage Courses', path: '/hod/courses', color: 'from-emerald-500 to-teal-500' },
    { icon: UserPlus2, text: 'Manage Coordinators', path: '/hod/coordinators', color: 'from-purple-500 to-indigo-500' },
    { icon: GraduationCap, text: 'View Students', path: '/hod/students', color: 'from-orange-500 to-red-500' },
    { icon: BarChart3, text: 'Reports', path: '/hod/reports', color: 'from-pink-500 to-rose-500' },
    {icon:SettingsIcon, text:'Settings',path:'/hod/settings',color:'from-pink-500 to-rose-500'}
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
    }`}>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 z-50 h-full transition-all duration-300 ${
        sidebarExpanded ? 'w-72' : 'w-20'
      } ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className={`h-full backdrop-blur-xl border-r transition-colors duration-300 ${
          darkMode 
            ? 'bg-slate-900/80 border-slate-700/50' 
            : 'bg-white/80 border-slate-200/50'
        }`}>
          {/* Logo Section */}
          <div className="p-6 border-b border-slate-200/10">
            {sidebarExpanded ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      HOD Portal
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Department Management
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setSidebarExpanded(false)}
                  className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                    darkMode 
                      ? 'hover:bg-slate-700/50 text-slate-400 hover:text-white' 
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={() => setSidebarExpanded(true)}
                  className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                    darkMode 
                      ? 'hover:bg-slate-700/50 text-slate-400 hover:text-white' 
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="p-2 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`group relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                    sidebarExpanded ? 'space-x-3' : 'justify-center'
                  } ${
                    active
                      ? `bg-gradient-to-r ${link.color} shadow-lg shadow-purple-500/25 text-white`
                      : darkMode
                      ? 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                  title={!sidebarExpanded ? link.text : undefined}
                >
                  {active && sidebarExpanded && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${
                    active ? 'scale-110' : 'group-hover:scale-110'
                  } ${!sidebarExpanded ? 'mx-auto' : ''}`} />
                  
                  {sidebarExpanded && (
                    <>
                      <span className="font-medium">{link.text}</span>
                      {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
            {/* Profile Card */}
            <div className={`p-4 rounded-xl backdrop-blur-sm border transition-colors duration-300 ${
              darkMode 
                ? 'bg-slate-800/30 border-slate-700/30' 
                : 'bg-slate-50/50 border-slate-200/30'
            }`}>
              <div className={`flex items-center ${sidebarExpanded ? 'space-x-3' : 'justify-center'}`}>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {(profile?.full_name || 'H').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800" />
                </div>
                {sidebarExpanded && (
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {profile?.full_name || 'HOD User'}
                    </p>
                    <p className={`text-xs truncate ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {profile?.department || 'Department Head'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${
                sidebarExpanded ? 'space-x-3' : 'justify-center'
              } ${
                darkMode 
                  ? 'hover:bg-red-500/10 text-slate-300 hover:text-red-400' 
                  : 'hover:bg-red-50 text-slate-600 hover:text-red-600'
              }`}
              title={!sidebarExpanded ? 'Sign Out' : undefined}
            >
              <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              {sidebarExpanded && (
                <span className="font-medium">Sign Out</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        sidebarExpanded ? 'lg:ml-72' : 'lg:ml-20'
      }`}>
        {/* Top Bar */}
        <header className={`sticky top-0 z-30 backdrop-blur-xl border-b transition-colors duration-300 ${
          darkMode 
            ? 'bg-slate-900/80 border-slate-700/50' 
            : 'bg-white/80 border-slate-200/50'
        }`}>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-xl lg:hidden transition-colors duration-200 ${
                  darkMode 
                    ? 'hover:bg-slate-700 text-slate-400' 
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className={`text-xl font-bold flex items-center space-x-2 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  <Crown className="w-5 h-5 text-purple-500" />
                  <span>Welcome back, {profile?.full_name?.split(' ')[0] || 'HOD'}!</span>
                </h1>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {profile?.department || 'Department Management'} • {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-4">
                <div className={`px-3 py-2 rounded-lg ${
                  darkMode ? 'bg-slate-800/50' : 'bg-slate-100/50'
                }`}>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      12 Courses
                    </span>
                  </div>
                </div>
                <div className={`px-3 py-2 rounded-lg ${
                  darkMode ? 'bg-slate-800/50' : 'bg-slate-100/50'
                }`}>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      8 Coordinators
                    </span>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <button className={`relative p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                darkMode 
                  ? 'hover:bg-slate-700 text-slate-400 hover:text-white' 
                  : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}>
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{notifications}</span>
                  </div>
                )}
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={handleDarkModeToggle}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                  darkMode 
                    ? 'hover:bg-slate-700 text-yellow-400' 
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HodDashboard;
