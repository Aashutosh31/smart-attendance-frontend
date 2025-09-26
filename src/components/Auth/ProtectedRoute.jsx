// src/components/Auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // --- FIX: Get the entire userProfile object from the store ---
  const { isAuthenticated, userProfile, isVerified } = useAuthStore();
  const location = useLocation();

  // --- FIX: Get the role safely from the userProfile object ---
  const role = userProfile?.role;

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
  
  // 3. Handle mandatory face verification (This logic remains the same)
  // NOTE: Based on your files, this is currently disabled in FaceVerificationRoute.jsx,
  // but the logic here is correct for when you re-enable it.
  const requiresVerificationRoles = ['faculty', 'hod', 'admin', 'student'];
  if (requiresVerificationRoles.includes(role) && !isVerified && role !== 'student' && !userProfile?.is_face_verified) {
      let verificationPath = '/login';
      if (role === 'admin') verificationPath = '/admin/verify';
      if (role === 'hod') verificationPath = '/hod/verify';
      if (role === 'faculty') verificationPath = '/faculty/verify';
      
      if (location.pathname !== verificationPath) {
          return <Navigate to={verificationPath} replace />;
      }
  }

  if (role === 'student' && !isVerified) {
    if (location.pathname !== '/student/verify') {
      return <Navigate to="/student/verify" replace />;
    }
  }


  // 4. If all checks pass, render the requested component.
  return children;
};

export default ProtectedRoute;