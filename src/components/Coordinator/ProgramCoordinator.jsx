import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';
import { UserPlus, BarChart3, Users, LogOut, BookOpen, Settings, Moon, Sun } from 'lucide-react';

const ProgramCoordinatorDashboard = () => {
  const navigate = useNavigate();
  const {signOut,profile} = useAuthStore();
  const [darkMode, setDarkMode] = React.useState(
    () => localStorage.getItem("theme") === "dark"
  );

  // Handle theme toggle
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  }

  const navItems = [
    { to: "/coordinator/add-student", name: "Add Student", icon: UserPlus },
    { to: "/coordinator/view-attendance", name: "View Attendance", icon: Users },
    { to: "/coordinator/coordinator-analytics", name: "Analytics", icon: BarChart3 },
    { to: "/coordinator/settings", name: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen dark:bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Sidebar */}
      <div className="w-64 glass-card border-r border-gray-200 dark:border-slate-800/50 p-6 space-y-6">
        {/* Header */}
        <div className="text-center pb-6 border-b border-gray-200 dark:border-slate-800/50">
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Program Coordinator
          </h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-500/20'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="pt-6 border-t border-gray-200 dark:border-slate-800/50">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header with Theme Toggle */}
        <div className="glass-card border-b border-gray-200 dark:border-slate-800/50 p-4">
          <div className="flex justify-end">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProgramCoordinatorDashboard;
