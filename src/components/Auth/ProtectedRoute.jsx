// File Path: src/components/Auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore"; // Corrected Import
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { loading, session, profile } = useAuthStore();

  // While the session is being initialized, show a loading indicator.
  // This is crucial to prevent redirecting before the auth state is known.
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // If not loading and there's no session, redirect to the login page.
  if (!session) {
    return <Navigate to="/login" />;
  }
  
  // If there is a session, but no specific roles are required, render the children.
  // This is used for the main "/" route that leads to RoleBasedRedirect.
  if (!allowedRoles) {
    return children;
  }

  // If roles are specified, check if the user's role is included.
  const userRole = profile?.role;
  if (allowedRoles.includes(userRole)) {
    return children;
  }

  // If the user's role is not allowed, redirect to an unauthorized page.
  return <Navigate to="/unauthorized" />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;