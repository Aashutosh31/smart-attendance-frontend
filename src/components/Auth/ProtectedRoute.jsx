import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { loading, session, user, isFaceEnrolled } = useAuthStore();
  const location = useLocation(); // Get the current URL location

  if (loading) {
    return <div>Loading...</div>; // Or a more stylish spinner component
  }
  if (!session || !user) {
    return <Navigate to="/login" />;
  }
  if (session && !isFaceEnrolled) {
    if (location.pathname !== "/enroll-face") {
      return <Navigate to="/enroll-face" />;
    }
  }
  if (allowedRoles) {
    const userRole = user?.role;
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" />;
    }
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;