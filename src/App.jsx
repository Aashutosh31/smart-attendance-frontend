import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./components/LoginPage.jsx";
import UnauthorizedPage from "./components/UnauthorizedPage.jsx";

// Import all your dashboard layouts and pages
import AdminDashboard from "./components/AdminDashboard.jsx";
import FacultyDashboard from "./components/Dashboard.jsx";
import StudentDashboard from "./components/StudentDashboard.jsx";
import DashboardOverview from "./components/DashboardOverview.jsx";
import CoursesPage from "./components/CoursesPage.jsx";
// ... other page imports

import "./index.css";

function App() {
  return (
    <>
     <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* --- FACULTY ROUTES --- */}
        <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
          <Route path="/" element={<FacultyDashboard />}>
            <Route index element={<DashboardOverview />} />
            <Route path="courses" element={<CoursesPage />} />
            {/* ... other faculty pages */}
          </Route>
        </Route>

        {/* --- ADMIN ROUTES --- */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          {/* ... other admin pages */}
        </Route>

        {/* --- STUDENT ROUTES --- */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student" element={<StudentDashboard />} />
          {/* ... other student pages */}
        </Route>

      </Routes>
    </Router>
    </>
  );
}

export default App;