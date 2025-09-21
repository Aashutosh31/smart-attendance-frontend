// src/components/Auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, isVerified } = useAuthStore();
  const location = useLocation();

  // 1. If user is not authenticated, redirect to login page.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Handle role-based access control
  // If a list of allowedRoles is provided, check if the user's role is in it.
  if (allowedRoles && !allowedRoles.includes(role)) {
    // User has a role, but not the right one for this route
    return <Navigate to="/unauthorized" replace />;
  }
  
  // 3. Handle mandatory face verification for HODs and Faculty
  const requiresVerification = role === 'faculty' || role === 'hod';
  if (requiresVerification && !isVerified) {
      const verificationPath = role === 'hod' ? '/hod/verify' : '/faculty/verify';
      // If they are not already on their verification page, send them there.
      if (location.pathname !== verificationPath) {
          return <Navigate to={verificationPath} replace />;
      }
  }

  // 4. If all checks pass, render the requested component.
  return children;
};

export default ProtectedRoute;