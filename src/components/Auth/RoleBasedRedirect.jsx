import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore.jsx';
import { Loader } from 'lucide-react';

const RoleBasedRedirect = () => {
  // --- FIX: Get the new loading and error states ---
  const { userProfile, isAuthenticated, isLoadingProfile, profileError } = useAuthStore();

  // If we are actively trying to fetch the profile, show the loader.
  if (isLoadingProfile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">Loading your dashboard...</p>
      </div>
    );
  }
  
  // --- NEW: If the profile fetch failed, show an error message ---
  if (profileError) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Failed to Load Profile</h1>
            <p className="text-gray-600 mt-2">Could not retrieve your user data. Please try logging in again.</p>
            <p className="text-xs text-gray-500 mt-4">Error: {profileError}</p>
        </div>
      </div>
    );
  }

  // If the user is authenticated and we have their profile, redirect them.
  if (isAuthenticated && userProfile) {
      const role = userProfile.role;
      switch (role) {
        case 'admin':
          return <Navigate to="/admin" replace />;
        case 'hod':
          return <Navigate to="/hod" replace />;
        case 'faculty':
          return <Navigate to="/faculty" replace />;
        case 'program_coordinator':
          return <Navigate to="/coordinator" replace />;
        case 'student':
            return <Navigate to="/student" replace />;
        default:
          // If role is unknown, send to login.
          return <Navigate to="/login" replace />;
      }
  }

  // Default fallback: if not authenticated, go to login.
  return <Navigate to="/login" replace />;
};

export default RoleBasedRedirect;