import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';
import { Loader } from 'lucide-react';

const RoleBasedRedirect = () => {
  const { role, isAuthenticated } = useAuthStore();

  // If the auth state is still loading, show a spinner.
  if (isAuthenticated && !role) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">Loading your dashboard...</p>
      </div>
    );
  }
  
  // Based on the user's role, navigate to the correct dashboard.
  switch (role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'hod':
      return <Navigate to="/hod" replace />;
    case 'faculty':
      return <Navigate to="/faculty" replace />; // The default dashboard
    case 'program_coordinator':
      return <Navigate to="/coordinator" replace />;
    case 'student':
        return <Navigate to="/student" replace />;
    default:
      // If the role is unknown or user is not authenticated, send to login.
      return <Navigate to="/login" replace />;
  }
};

export default RoleBasedRedirect;