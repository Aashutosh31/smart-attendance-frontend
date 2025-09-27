// src/components/Auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userProfile } = useAuthStore();
  const location = useLocation();
  const role = userProfile?.role;

  // 1. If user is not authenticated, redirect to the login page.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If a route requires a specific role, check if the user has it.
  // If not, redirect to the "Access Denied" page.
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // 3. If all checks pass, show the requested page.
  // All verification logic has been removed from this file.
  return children;
};

export default ProtectedRoute;