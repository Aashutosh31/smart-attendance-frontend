import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- CORE & AUTH COMPONENTS ---
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import LoginPage from "./components/Auth/LoginPage.jsx";
import UnauthorizedPage from "./components/Auth/UnauthorizedPage.jsx";
import CollegeRegistrationPage from "./components/Auth/CollegeRegistrationPage.jsx";
import RoleBasedRedirect from "./components/Auth/RoleBasedRedirect.jsx"; 

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
import AdminAnalyticsPage from "./components/Admin/AdminAnalyticsPage.jsx";
import ManageHodsPage from "./components/Admin/ManageHods.jsx";
import ViewStudentsPage from "./components/Admin/ViewStudents.jsx";

// HOD
import HodVerificationPage from "./components/HOD/HodVerificationPage.jsx";
import FacultyAttendancePage from "./components/HOD/FacultyAttendancePage.jsx";
import FacultyReportsPage from "./components/HOD/FacultyReportsPage.jsx";
import StudentReportsPage from "./components/HOD/StudentsReportPage.jsx"; 
import ManageCoordinatorsPage from "./components/HOD/ManageCoordinators.jsx";

// Coordinator
import AddStudentPage from "./components/Coordinator/AddStudentPage.jsx";
import ManageCoursesPage from "./components/Coordinator/ManageCoursesPage.jsx";
import CoordinatorAttendancePage from "./components/Coordinator/CoordinatorAttendancePage.jsx";
import CoordinatorAnalytics from "./components/Coordinator/CoordinatorAnalytics.jsx";



// Other imports
import "./index.css";
import SettingsPage from "./components/Shared/SettingsPage.jsx";
import React, { useEffect } from 'react';
import { useThemeStore } from "./store/ThemeStore";

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="light" />
      <Router>
        <Routes>
          {/* --- PUBLIC & AUTH ROUTES --- */}
          <Route path="/register-college" element={<CollegeRegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* --- THE NEW REDIRECT ROUTE --- */}
          {/* Any logged-in user trying to access the root will be redirected based on their role */}
          <Route path="/" element={<ProtectedRoute><RoleBasedRedirect /></ProtectedRoute>} />

          {/* --- FACULTY ROUTES --- */}
            {/* NOTE THE NEW PATHS: "/faculty" */}
            <Route path="/faculty" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>}>
            <Route index element={<DashboardOverview />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
            <Route path="/faculty/verify" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyVerificationPage /></ProtectedRoute>} />

          {/* --- ADMIN ROUTES --- */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}>
            <Route index element={<AdminReportsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="manage-hods" element={<ManageHodsPage />} />
            <Route path="manage-faculty" element={<ManageFacultyPage />} />
            <Route path="view-students" element={<ViewStudentsPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* --- HOD ROUTES --- */}
            <Route path="/hod" element={<ProtectedRoute allowedRoles={['hod']}><HodDashboard /></ProtectedRoute>}>
            <Route index element={<FacultyAttendancePage />} />
            <Route path="faculty-attendance" element={<FacultyAttendancePage />} />
            <Route path="manage-coordinators" element={<ManageCoordinatorsPage />} />
            <Route path="manage-faculty" element={<ManageFacultyPage />} />
            <Route path="faculty-reports" element={<FacultyReportsPage />} />
            <Route path="student-reports" element={<StudentReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
            <Route path="/hod/verify" element={<ProtectedRoute allowedRoles={['hod']}><HodVerificationPage /></ProtectedRoute>} />
          
          {/* --- PROGRAM COORDINATOR ROUTES --- */}
            <Route path="/coordinator" element={<ProtectedRoute allowedRoles={['program_coordinator']}><ProgramCoordinatorDashboard /></ProtectedRoute>}>
            <Route index element={<AddStudentPage />} />
            <Route path="add-student" element={<AddStudentPage />} />
            <Route path="manage-courses" element={<ManageCoursesPage />} />
            <Route path="view-attendance" element={<CoordinatorAttendancePage />} />
            <Route path="coordinator-analytics" element={<CoordinatorAnalytics />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* --- STUDENT ROUTES --- */}
            <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
