import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';
import { UserPlus, BarChart3, Users, LogOut, BookOpen, Settings } from 'lucide-react'; // Import Settings icon

const ProgramCoordinatorDashboard = () => {
  const navigate = useNavigate();
  const logoutAction = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  const navItems = [
    { to: "/coordinator/add-student", name: "Add Student", icon: UserPlus },
    { to: "/coordinator/manage-courses", name: "Manage Courses", icon: BookOpen },
    { to: "/coordinator/view-attendance", name: "View Attendance", icon: Users },
    { to: "/coordinator/analytics", name: "Analytics", icon: BarChart3 },
    { to: "/coordinator/settings", name: "Settings", icon: Settings }, // Added Settings link
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
       <aside className="w-64 bg-gray-900 dark:bg-gray-800 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-700 dark:border-gray-600">
          <h1 className="text-2xl font-bold">Coordinator Panel</h1>
        </div>
        <nav className="flex-1 mt-6">
          <ul className="space-y-2 px-4">
            {navItems.map(item => (
              <li key={item.name}>
                <NavLink to={item.to} className={({isActive}) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
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
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Program Coordinator</h2>
        </header>
        <div className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProgramCoordinatorDashboard;