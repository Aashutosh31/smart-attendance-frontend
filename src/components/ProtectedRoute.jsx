import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore.jsx';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role, isVerified } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isFaculty = role === 'faculty';
  const isVerificationPage = location.pathname === '/verify';

  if (isFaculty && !isVerified) {
    return isVerificationPage ? <Outlet /> : <Navigate to="/verify" replace />;
  }

  if (isFaculty && isVerified && isVerificationPage) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && allowedRoles.includes(role)) {
    return <Outlet />;
  }

  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;