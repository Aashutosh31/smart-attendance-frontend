import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore.jsx';
import { Loader } from 'lucide-react';

const RoleBasedRedirect = () => {
  const { userProfile, isAuthenticated } = useAuthStore();

  // If the user is logged in but we are still waiting for their profile details,
  // show the loading spinner. This is the state that was causing the freeze.
  if (isAuthenticated && !userProfile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">Loading your dashboard...</p>
      </div>
    );
  }
  
  // Once the userProfile is loaded, get the role from it.
  const role = userProfile?.role;

  // Navigate based on the fetched role.
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
      // If there's no role or the user is not authenticated, send to login.
      return <Navigate to="/login" replace />;
  }
};

export default RoleBasedRedirect;
