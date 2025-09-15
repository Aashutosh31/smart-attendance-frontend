import React, { useState,useEffect } from 'react';
// Import NavLink for smart navigation, Outlet for nested pages, and useNavigate for redirection
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
// Import the Zustand store to get the logout action
import { useAuthStore } from '../../store/AuthStore';
// Import all the icons you need
import { Home, BookOpen, BarChart3, Settings, Bell, ChevronDown } from 'lucide-react';
//import theme store
import { useThemeStore } from '../../store/ThemeStore.jsx';

const FacultyDashboard = () => {
   const { theme } = useThemeStore(); // Get the current theme

  // Add a useEffect to apply the theme to the <html> tag
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  // Get the logout action from your Zustand store
  const logoutAction = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // The navigation items are now an array for a cleaner setup
  const navItems = [
    { to: "/", name: "Dashboard", icon: Home },
    { to: "/courses", name: "Courses", icon: BookOpen },
    { to: "/analytics", name: "Analytics", icon: BarChart3 },
    { to: "/settings", name: "Settings", icon: Settings },
  ];

  // This function handles logging the user out by calling the store's action
  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">AttendTrack</h1>
        </div>
        <nav className="flex-1 mt-6">
          <ul className="space-y-2 px-4">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.name}>
                  {/* NavLink automatically adds styling to the link of the current page */}
                  <NavLink
                    to={item.to}
                    end={item.to === "/"} // Ensures only the exact Dashboard link is active
                    className={({ isActive }) =>
                      `w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                        isActive 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`
                    }
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Faculty Portal</h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">JD</div>
                  <span className="text-gray-700 font-medium">Prof. John Doe</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* --- DYNAMIC PAGE CONTENT --- */}
        {/* The <Outlet /> is a placeholder where your different pages will be rendered */}
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;