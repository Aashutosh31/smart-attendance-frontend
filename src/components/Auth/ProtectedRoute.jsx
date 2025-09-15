import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore.jsx';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role, isVerified } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isFaculty = role === 'faculty';
  const isHod = role === 'hod';
  const isVerificationPage = location.pathname === '/verify' || location.pathname === '/hod/verify';

  // Handle Faculty Verification
  if (isFaculty && !isVerified) {
    return location.pathname === '/verify' ? <Outlet /> : <Navigate to="/verify" replace />;
  }
  // --- FIX --- Use the 'isVerificationPage' variable
  if (isFaculty && isVerified && isVerificationPage) {
    return <Navigate to="/" replace />;
  }
  
  // Handle HOD Verification
  if (isHod && !isVerified) {
    return location.pathname === '/hod/verify' ? <Outlet /> : <Navigate to="/hod/verify" replace />;
  }
  // --- FIX --- Use the 'isVerificationPage' variable
  if (isHod && isVerified && isVerificationPage) {
    return <Navigate to="/hod" replace />;
  }

  if (allowedRoles && allowedRoles.includes(role)) {
    return <Outlet />;
  }
  
  if (allowedRoles && !allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;