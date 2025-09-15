import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import { UserCheck, Users, LogOut, Bell, AlertTriangle, BarChart3 } from 'lucide-react'; // Added BarChart3
import { toast } from 'react-toastify';

const HodDashboard = () => {
  const navigate = useNavigate();
  const { logout: logoutAction, token } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/hod/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Could not fetch notifications.');
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            toast.error(error.message);
        }
    };
    fetchNotifications();
  }, [token]);

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  const navItems = [
    { to: "/hod/faculty-attendance", name: "Daily Attendance", icon: UserCheck },
    // --- NEW LINK ADDED HERE ---
    { to: "/hod/faculty-reports", name: "Faculty Reports", icon: BarChart3 },
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
      
<div className="flex-1 flex flex-col">
  <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 z-10">
    <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">HOD Dashboard</h2>
        <div className="relative">
            <button onClick={() => setIsNotificationOpen(prev => !prev)} className="p-2 text-gray-500 hover:text-gray-700 relative">
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{notifications.length}</span>
                )}
  </button>
  {isNotificationOpen && (
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-20">
          <div className="p-3 font-semibold border-b">Notifications</div>
          <ul className="py-2 max-h-96 overflow-y-auto">
              {notifications.length > 0 ? notifications.map(notif => (
                  <li key={notif.id} className="flex items-start p-3 hover:bg-gray-100">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                          <p className="text-sm text-gray-700">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(notif.date).toLocaleString()}</p>
                      </div>
                  </li>
              )) : <li className="p-4 text-sm text-gray-500">No new notifications.</li>}
          </ul>
      </div>
  )}
</div>
</div>
  </header>
  <main className="flex-1 p-6 overflow-auto">
    <Outlet />
  </main>
</div>
</div>
  );
};

export default HodDashboard;