// File Path: src/components/Admin/AdminDashboard.jsx
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Users,
  UserCheck,
  Building,
  LogOut,
  Settings,
  Sun,
  Moon,
  Bell,
  UserCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/AuthStore'; // 2. Import the Auth Store

// This is your original component structure, preserved.
const AdminDashboard = () => {
  // 3. Add the logic needed for sign-out
  const { signOut, profile } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login'); // Redirect after sign-out is complete
  };

  const navLinks = [
    { icon: BarChart3, text: 'Analytics', path: '/admin/analytics' },
    { icon: FileText, text: 'Reports', path: '/admin/reports' },
    { icon: Building, text: 'Manage HODs', path: '/admin/manage-hods' },
    { icon: UserCheck, text: 'Manage Faculty', path: '/admin/manage-faculty' },
    { icon: Users, text: 'View Students', path: '/admin/view-students' },
  ];

  return (
    <div className="flex h-screen bg-slate-900 text-gray-300 font-sans">
      {/* Sidebar - Your original design */}
      <aside className="w-64 flex-shrink-0 bg-slate-800/50 backdrop-blur-lg border-r border-purple-500/20">
        <div className="flex flex-col h-full">
          <div className="h-20 flex items-center justify-center border-b border-purple-500/20">
            <LayoutDashboard className="text-purple-400 h-8 w-8" />
            <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Admin Portal
            </h1>
          </div>
          <nav className="flex-grow px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-purple-500/20 hover:text-white transition-all duration-200 group"
              >
                <link.icon className="h-5 w-5 mr-3 text-purple-400/70 group-hover:text-purple-300" />
                <span>{link.text}</span>
              </Link>
            ))}
          </nav>
          <div className="px-4 py-6 border-t border-purple-500/20 space-y-2">
            <Link
              to="/admin/settings"
              className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-purple-500/20 hover:text-white transition-all duration-200 group"
            >
              <Settings className="h-5 w-5 mr-3 text-purple-400/70 group-hover:text-purple-300" />
              <span>Settings</span>
            </Link>
            {/* 4. Attach the handleSignOut function to your original button */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 group"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Your original design */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-lg border-b border-purple-500/20">
          <div>
            <h2 className="text-xl font-semibold">Welcome, {profile?.full_name || 'Admin'}!</h2>
            <p className="text-sm text-gray-400">
              Here's what's happening in your institution today.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <button className="p-2 rounded-full hover:bg-slate-700 transition-colors">
              <Sun className="h-5 w-5 text-yellow-400" />
            </button>
            <button className="relative p-2 rounded-full hover:bg-slate-700 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="flex items-center">
              <UserCircle className="h-9 w-9 text-purple-400" />
              <div className="ml-3">
                <p className="font-semibold text-sm">{profile?.full_name}</p>
                <p className="text-xs text-gray-400">{profile?.role}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;