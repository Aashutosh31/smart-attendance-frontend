import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';
import { Loader } from 'lucide-react';

// --- MASTER SWITCH FOR FACIAL VERIFICATION ---
// Set this to 'false' to disable verification for development.
// Set this to 'true' to re-enable verification for production.
const verificationEnabled = false;

const FaceVerificationRoute = ({ children }) => {
  const { role, isVerified, userProfile, isAuthenticated } = useAuthStore();
  const location = useLocation();

  // If verification is disabled, just render the dashboard immediately.
  if (!verificationEnabled) {
    return children;
  }
  
  // --- The original verification logic remains below ---
  // --- It will only run if verificationEnabled is true. ---

  // Show a loader while the user profile (which contains is_face_verified) is being fetched.
  if (isAuthenticated && !userProfile) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
            <Loader className="h-12 w-12 animate-spin text-blue-600" />
            <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">Loading user profile...</p>
        </div>
    );
  }

  // One-time verification logic for Admin and HOD
  if (role === 'admin' || role === 'hod') {
    if (userProfile && !userProfile.is_face_verified) {
      const verificationPath = role === 'admin' ? '/admin/verify' : '/hod/verify';
      if (location.pathname !== verificationPath) {
        return <Navigate to={verificationPath} replace />;
      }
    }
  }

  // Session-based verification logic for Faculty and Student
  if (role === 'faculty' || role === 'student') {
    if (!isVerified) {
      const verificationPath = role === 'faculty' ? '/faculty/verify' : '/student/verify';
      if (location.pathname !== verificationPath) {
        return <Navigate to={verificationPath} replace />;
      }
    }
  }

  // If verification is enabled and all checks pass, render the requested component.
  return children;
};

export default FaceVerificationRoute;
