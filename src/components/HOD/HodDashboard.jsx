import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';
import { UserCheck, Users, LogOut, Bell, AlertTriangle, BarChart3, Settings } from 'lucide-react';
import { toast } from 'react-toastify';

const HodDashboard = () => {
  const navigate = useNavigate();
  const { logout: logoutAction, token } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  React.useEffect(() => {
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
    { to: "/hod/manage-faculty", name: "Manage Faculty", icon: Users }, // NEW
    { to: "/hod/faculty-reports", name: "Faculty Reports", icon: BarChart3 },
    { to: "/hod/student-reports", name: "Student Reports", icon: Users },
    { to: "/hod/settings", name: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
       <aside className="w-64 bg-gray-900 dark:bg-gray-800 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-700 dark:border-gray-600">
          <h1 className="text-2xl font-bold">HOD Portal</h1>
        </div>
        <nav className="flex-1 mt-6">
          <ul className="space-y-2 px-4">
            {navItems.map(item => (
              <li key={item.name}>
                <NavLink to={item.to} className={({isActive}) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
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
      
      <div className="flex-1 flex flex-col">
<header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 z-10">
  <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">HOD Dashboard</h2>
      <div className="relative">
          <button onClick={() => setIsNotificationOpen(prev => !prev)} className="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white relative">
              <Bell className="w-6 h-6" />
              {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{notifications.length}</span>
              )}
          </button>
          {isNotificationOpen && (
      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-20">
          <div className="p-3 font-semibold border-b dark:border-gray-600 text-gray-800 dark:text-white">Notifications</div>
      <ul className="py-2 max-h-96 overflow-y-auto">
          {notifications.length > 0 ? notifications.map(notif => (
              <li key={notif.id} className="flex items-start p-3 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{notif.message}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(notif.date).toLocaleString()}</p>
                  </div>
              </li>
          )) : <li className="p-4 text-sm text-gray-500 dark:text-gray-400">No new notifications.</li>}
      </ul>
              </div>
          )}
      </div>
  </div>
</header>
          <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
            <Outlet />
          </main>
      </div>
    </div>
  );
};

export default HodDashboard;