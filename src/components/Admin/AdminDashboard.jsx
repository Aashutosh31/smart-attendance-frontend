import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';
import { Shield, Users, LogOut, BarChart3, Settings, UserSquare, Loader } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout: logoutAction, isAuthenticated, collegeId } = useAuthStore();

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  const navItems = [
    { to: "/admin/reports", name: "Reports", icon: BarChart3 },
    { to: "/admin/manage-hods", name: "Manage HODs", icon: UserSquare },
    { to: "/admin/manage-coordinators", name: "Manage Coordinators", icon: UserSquare },
    { to: "/admin/manage-faculty", name: "Manage Faculty", icon: Users },
    { to: "/admin/view-students", name: "View Students", icon: Users },
    { to: "/admin/analytics", name: "Analytics", icon: BarChart3 },
    { to: "/admin/settings", name: "Settings", icon: Settings },
  ];

  // --- NEW: Loading check ---
  // If the user is authenticated but we don't have a collegeId yet,
  // it means the auth state is still loading. Show a loading screen.
  if (isAuthenticated && !collegeId) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader className="h-12 w-12 animate-spin text-yellow-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <aside className="w-64 bg-gray-900 dark:bg-gray-800 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-700 dark:border-gray-600 flex items-center space-x-3">
          <Shield className="text-yellow-400" />
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1 mt-6">
          <ul className="space-y-2 px-4">
            {navItems.map(item => (
              <li key={item.name}>
                <NavLink 
                  to={item.to} 
                  className={({isActive}) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-yellow-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700 dark:border-gray-600">
          <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-lg hover:bg-red-600 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 z-10">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Administrator</h2>
        </header>
        <div className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
            {/* The Outlet will now only render when collegeId is available */}
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;