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
import AnalyticsPage from "./components/AnalyticsPage.jsx";
import SettingsPage from "./components/SettingsPage.jsx";

import "./index.css";

function App() {
  return (
    <>
      {/* This container is for the toast pop-up notifications */}
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
          {/* --- PUBLIC ROUTES --- */}
          {/* These pages can be seen by anyone, logged in or not. */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* --- FACULTY ROUTES --- */}
          {/* This entire section is protected. Only users with the 'faculty' role can access it. */}
          {/* The main URL ("/") is the faculty's home. */}
          <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
            <Route path="/" element={<FacultyDashboard />}>
              <Route index element={<DashboardOverview />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* --- ADMIN ROUTES --- */}
          {/* This section is protected. Only users with the 'admin' role can access it. */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            {/* You can add more admin-specific pages here later */}
          </Route>

          {/* --- STUDENT ROUTES --- */}
          {/* This section is protected. Only users with the 'student' role can access it. */}
          {/* Note: This is for the web version. The React Native app will use the same logic. */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student" element={<StudentDashboard />} />
            {/* You can add more student-specific pages here later */}
          </Route>
          
        </Routes>
      </Router>
    </>
  );
}

export default App;