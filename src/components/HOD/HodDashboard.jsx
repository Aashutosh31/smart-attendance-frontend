import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";

import {
  Shield,
  Users,
  LogOut,
  BarChart3,
  Settings,
  UserSquare,
  Loader,
  Sun,
  Moon,
  BookAIcon,
} from "lucide-react";

const HodDashboard = () => {
  const navigate = useNavigate();
  const { logout: logoutAction, isAuthenticated, collegeId } = useAuthStore();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    logoutAction();
    navigate("/login");
  };

  const navItems = [
      { to: "/hod/faculty-attendance", name: "Faculty Attendance", icon: Users },
    { to: "/hod/manage-coordinators", name: "Manage Coordinators", icon: UserSquare },
    {to:"/hod/manage-courses", name:"Manage Courses",
      icon:BookAIcon
    },
    { to: "/hod/manage-faculty", name: "Manage Faculty", icon: Users },
    { to: "/hod/student-reports", name: "View Students", icon: Users },
    { to: "/hod/faculty-reports", name: "Analytics", icon: BarChart3 },
    { to: "/hod/settings", name: "Settings", icon: Settings },
  ];

  if (isAuthenticated && !collegeId) {
    return (
      <div className="min-h-screen app-bg flex justify-center items-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-bg dark:bg-gradient-to-br dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950">
      <div className="flex">
        {/* Sidebar - FIXED: proper positioning for Sign Out button */}
        <div className="w-64 min-h-screen bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border-r border-gray-200 dark:border-slate-800/50 dark:shadow-2xl relative">
          {/* Logo section */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-slate-800/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500 dark:bg-gradient-to-br dark:from-fuchsia-500 dark:to-purple-600 rounded-xl">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white">HOD Panel</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-3 pb-20">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-orange-100 text-orange-600 dark:bg-gradient-to-r dark:from-fuchsia-500/30 dark:to-purple-500/30 dark:text-black dark:shadow-lg dark:shadow-fuchsia-500/25"
                        : "text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800/50"
                    }`
                  }
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* FIXED: Sign Out button positioned properly within sidebar */}
          <div className="absolute bottom-4 left-3 right-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 dark:bg-gradient-to-r dark:from-fuchsia-600 dark:to-purple-600 dark:shadow-lg dark:shadow-fuchsia-500/25 rounded-lg hover:bg-red-700 dark:hover:shadow-fuchsia-500/40 transition-all"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border-b border-gray-200 dark:border-slate-800/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Head of Department</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 text-gray-500 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <div className="w-8 h-8 bg-purple-600 dark:bg-gradient-to-br dark:from-fuchsia-500 dark:to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  H
                </div>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="p-6">
            <div className="card dark:bg-slate-900/60 dark:backdrop-blur-xl dark:border-slate-800/50 p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default HodDashboard;
