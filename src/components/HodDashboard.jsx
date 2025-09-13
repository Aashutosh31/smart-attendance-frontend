import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import { UserCheck, Users, BarChart3, LogOut } from 'lucide-react';

const HodDashboard = () => {
  const navigate = useNavigate();
  const logoutAction = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  const navItems = [
    { to: "/hod/faculty-attendance", name: "Faculty Attendance", icon: UserCheck },
    { to: "/hod/student-reports", name: "Student Reports", icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
       <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">HOD Portal</h1>
        </div>
        <nav className="flex-1 mt-6">
          <ul className="space-y-2 px-4">
            {navItems.map(item => (
              <li key={item.name}>
                <NavLink to={item.to} className={({isActive}) => `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'}`}>
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-lg hover:bg-red-600">
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default HodDashboard;