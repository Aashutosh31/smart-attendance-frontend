import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- CORE & AUTH COMPONENTS ---
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import LoginPage from "./components/Auth/LoginPage.jsx";
import UnauthorizedPage from "./components/Auth/UnauthorizedPage.jsx";

// --- LAYOUTS / DASHBOARDS ---
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import FacultyDashboard from "./components/Faculty/Dashboard.jsx";
import HodDashboard from "./components/HOD/HodDashboard.jsx";
import StudentDashboard from "./components/Student/StudentDashboard.jsx";
import ProgramCoordinatorDashboard from "./components/Coordinator/ProgramCoordinator.jsx";

// --- PAGES ---
// Faculty
import DashboardOverview from "./components/Faculty/DashboardOverview.jsx";
import CoursesPage from "./components/Faculty/CoursesPage.jsx";
import AnalyticsPage from "./components/Faculty/AnalyticsPage.jsx";
import FacultyVerificationPage from "./components/Faculty/FacultyVerificationPage.jsx";

// Admin
import AdminReportsPage from "./components/Admin/AdminReportsPage.jsx";
import ManageFacultyPage from "./components/Admin/ManageFaculty.jsx";
import ManageStudentsPage from "./components/Admin/ManageStudentsPage.jsx";
import AdminAnalyticsPage from "./components/Admin/AdminAnalyticsPage.jsx";

// HOD
import HodVerificationPage from "./components/HOD/HodVerificationPage.jsx";
import FacultyAttendancePage from "./components/HOD/FacultyAttendancePage.jsx";
import FacultyReportsPage from "./components/HOD/FacultyReportsPage.jsx";
import StudentReportsPage from "./components/HOD/StudentsReportPage.jsx"; 

// Coordinator
import AddStudentPage from "./components/Coordinator/AddStudentPage.jsx";
import ManageCoursesPage from "./components/Coordinator/ManageCoursesPage.jsx";
import CoordinatorAttendancePage from "./components/Coordinator/CoordinatorAttendancePage.jsx";
import CoordinatorAnalytics from "./components/Coordinator/CoordinatorAnalytics.jsx";

//other imports
import "./index.css";
import SettingsPage from "./components/Shared/SettingsPage.jsx";

// --- NEW IMPORTS ---
import React, { useEffect } from 'react';
import { useThemeStore } from "./store/ThemeStore";

function App() {
  // --- NEW THEME LOGIC ---
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);
  // --- END OF NEW LOGIC ---
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="light" />
      <Router>
        <Routes>
          {/* --- PUBLIC & AUTH ROUTES --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/verify" element={<FacultyVerificationPage />} />
          <Route path="/hod/verify" element={<HodVerificationPage />} />

          {/* --- FACULTY ROUTES --- */}
            <Route path="/" element={<FacultyDashboard />}>
              <Route index element={<DashboardOverview />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

          {/* --- ADMIN ROUTES --- */}
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<AdminReportsPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="manage-faculty" element={<ManageFacultyPage />} />
              <Route path="manage-students" element={<ManageStudentsPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

          {/* --- HOD ROUTES --- */}
            <Route path="/hod" element={<HodDashboard />}>
              <Route index element={<FacultyAttendancePage />} />
              <Route path="faculty-attendance" element={<FacultyAttendancePage />} />
              <Route path="faculty-reports" element={<FacultyReportsPage />} />
              <Route path="student-reports" element={<StudentReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          
          {/* --- PROGRAM COORDINATOR ROUTES --- */}
            <Route path="/coordinator" element={<ProgramCoordinatorDashboard />}>
              <Route index element={<AddStudentPage />} />
              <Route path="add-student" element={<AddStudentPage />} />
              <Route path="manage-courses" element={<ManageCoursesPage />} />
              <Route path="view-attendance" element={<CoordinatorAttendancePage />} />
              <Route path="analytics" element={<CoordinatorAnalytics />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

          {/* --- STUDENT ROUTES --- */}
            <Route path="/student" element={<StudentDashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;