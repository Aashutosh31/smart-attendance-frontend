import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';
import { Home, BookOpen, BarChart3, Settings, Bell, ChevronDown } from 'lucide-react';

const FacultyDashboard = () => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const logoutAction = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const navItems = [
    { to: "/", name: "Dashboard", icon: Home },
    { to: "/courses", name: "Courses", icon: BookOpen },
    { to: "/analytics", name: "Analytics", icon: BarChart3 },
    { to: "/settings", name: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <aside className="w-64 bg-gray-900 dark:bg-gray-800 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-700 dark:border-gray-600">
          <h1 className="text-2xl font-bold text-white">AttendTrack</h1>
        </div>
        <nav className="flex-1 mt-6">
          <ul className="space-y-2 px-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Faculty Portal</h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">EX</div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Example</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </button>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-20">
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;