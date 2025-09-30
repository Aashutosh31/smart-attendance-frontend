// File Path: src/components/HOD/HodDashboard.jsx
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  FileText,
  Settings,
  LogOut,
  UserCircle,
  Bell,
} from 'lucide-react';
import { useAuthStore } from '../../store/AuthStore'; // 2. Import the Auth Store

const HodDashboard = () => {
  // 3. Add the logic needed for sign-out
  const { signOut, profile } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login'); // Redirect after sign-out is complete
  };

  const navLinks = [
    { icon: ClipboardCheck, text: 'Faculty Attendance', path: '/hod/faculty-attendance' },
    { icon: Users, text: 'Manage Coordinators', path: '/hod/manage-coordinators' },
    { icon: BookOpen, text: 'Manage Courses', path: '/hod/manage-courses' },
    { icon: Users, text: 'Manage Faculty', path: '/hod/manage-faculty' },
    { icon: FileText, text: 'Faculty Reports', path: '/hod/faculty-reports' },
    { icon: FileText, text: 'Student Reports', path: '/hod/student-reports' },
  ];

  return (
    <div className="flex h-screen bg-slate-900 text-gray-300">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-800/50 backdrop-blur-lg border-r border-teal-500/20">
        <div className="flex flex-col h-full">
          <div className="h-20 flex items-center justify-center border-b border-teal-500/20">
            <LayoutDashboard className="text-teal-400 h-8 w-8" />
            <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
              HOD Portal
            </h1>
          </div>
          <nav className="flex-grow px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-teal-500/20 hover:text-white transition-all duration-200 group"
              >
                <link.icon className="h-5 w-5 mr-3 text-teal-400/70 group-hover:text-teal-300" />
                <span>{link.text}</span>
              </Link>
            ))}
          </nav>
          <div className="px-4 py-6 border-t border-teal-500/20 space-y-2">
            <Link
              to="/hod/settings"
              className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-teal-500/20 hover:text-white transition-all duration-200 group"
            >
              <Settings className="h-5 w-5 mr-3 text-teal-400/70 group-hover:text-teal-300" />
              <span>Settings</span>
            </Link>
            {/* 4. Attach the handleSignOut function to the sign-out button */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-lg border-b border-teal-500/20">
          <div>
            <h2 className="text-xl font-semibold">Welcome, {profile?.full_name || 'HOD'}!</h2>
            <p className="text-sm text-gray-400">
              Oversee your department's activities.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <UserCircle className="h-9 w-9 text-teal-400" />
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

export default HodDashboard;