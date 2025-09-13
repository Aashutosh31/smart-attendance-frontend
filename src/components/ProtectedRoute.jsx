import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// The component now accepts a prop: an array of roles that are allowed to see the page
const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');

  // 1. First, check if the user is logged in at all
  if (!token) {
    return <Navigate to="/login" />;
  }

  // 2. If they are logged in, check if their role is in the list of allowed roles
  // If allowedRoles is provided and the user's role is included, let them in
  if (allowedRoles && allowedRoles.includes(userRole)) {
    return <Outlet />;
  }

  // 3. If they are logged in but have the WRONG role, send them to an "Unauthorized" page
  // (We will create this page next)
  return <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;