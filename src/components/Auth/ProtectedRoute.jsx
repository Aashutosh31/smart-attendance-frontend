import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { loading, session, profile, isFaceEnrolled } = useAuthStore();
  const location = useLocation(); // Get the current URL location

  if (loading) {
    return <div>Loading...</div>; // Or a more stylish spinner component
  }

  // If the user is not logged in at all, send them to the login page.
  if (!session) {
    return <Navigate to="/login" />;
  }
  
  // THE CRITICAL LOGIC:
  // If the user is logged in BUT needs to enroll their face...
  if (session && !isFaceEnrolled) {
    // ...only redirect them IF they are NOT already on the enrollment page.
    if (location.pathname !== "/enroll-face") {
      return <Navigate to="/enroll-face" />;
    }
  }

  // If the route has specific role requirements, check them.
  if (allowedRoles) {
    const userRole = profile?.role;
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" />;
    }
  }

  // If all checks pass, render the component the user asked for.
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;