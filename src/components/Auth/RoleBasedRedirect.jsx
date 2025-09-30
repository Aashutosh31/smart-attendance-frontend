// File Path: src/components/Auth/RoleBasedRedirect.jsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore"; // Corrected Import

const RoleBasedRedirect = () => {
  const { profile } = useAuthStore();

  // Determine the dashboard path based on the user's role from their profile.
  const getDashboardPath = () => {
    const role = profile?.role;
    switch (role) {
      case "admin":
        return "/admin";
      case "hod":
        return "/hod";
      case "faculty":
        return "/faculty";
      case "program_coordinator":
        return "/coordinator";
      case "student":
        return "/student";
      default:
        // If role is unknown or missing, send to login as a fallback.
        return "/login";
    }
  };

  const dashboardPath = getDashboardPath();

  // Use the Navigate component to perform the redirection.
  return <Navigate to={dashboardPath} replace />;
};

export default RoleBasedRedirect;