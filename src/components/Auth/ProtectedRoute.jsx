// File Path: src/components/Auth/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, isVerified, isFaceEnrolled } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // --- THE FIX: Check for face enrollment first ---
  if (!isFaceEnrolled) {
    return <Navigate to="/enroll-face" replace />;
  }
  
  // After face enrollment, check for verification
  if (!isVerified) {
    toast.info("Please complete your profile verification.");
    const verificationPath = `/${role}/verify`;
    return <Navigate to={verificationPath} replace />;
  }
  
  // After verification, check for role
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;