import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Core Components & Layouts
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./components/LoginPage.jsx";
import UnauthorizedPage from "./components/UnauthorizedPage.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import FacultyDashboard from "./components/Dashboard.jsx";
import HodDashboard from "./components/HodDashboard.jsx";
import StudentDashboard from "./components/StudentDashboard.jsx";
import ProgramCoordinatorDashboard from "./components/ProgramCoordinator.jsx";

// Pages
import DashboardOverview from "./components/DashboardOverview.jsx";
import CoursesPage from "./components/CoursesPage.jsx";
import AnalyticsPage from "./components/AnalyticsPage.jsx";
import SettingsPage from "./components/SettingsPage.jsx";
import FacultyVerificationPage from "./components/FacultyVerificationPage.jsx";
import ManageFacultyPage from "./components/ManageFaculty.jsx";
import FacultyAttendancePage from "./components/FacultyAttendancePage.jsx";
import StudentReportsPage from "./components/StudentsReportPage.jsx";
import AddStudentPage from "./components/AddStudentPage.jsx";
import ManageStudentsPage from "./components/ManageStudentsPage.jsx";
import AdminAnalyticsPage from "./components/AdminAnalyticsPage.jsx";
import CoordinatorAttendancePage from "./components/CoordinatorAttendancePage.jsx";
import ManageCoursesPage from "./components/ManageCoursesPage.jsx";
import CoordinatorAnalytics from "./components/CoordinatorAnalytics.jsx";
import HodVerificationPage from "./components/HodVerificationPage.jsx";
import AdminReportsPage from "./components/AdminReportsPage.jsx";
// --- NEW IMPORT ---
import FacultyReportsPage from "./components/FacultyReportsPage.jsx";


import "./index.css";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="light" />
      <Router>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* --- FACULTY ROUTES --- */}
            <Route path="/verify" element={<FacultyVerificationPage />} />
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
            </Route>

          {/* --- HOD ROUTES --- */}
            <Route path="/hod/verify" element={<HodVerificationPage />} />
            <Route path="/hod" element={<HodDashboard />}>
              <Route index element={<FacultyAttendancePage />} />
              <Route path="faculty-attendance" element={<FacultyAttendancePage />} />
              {/* --- NEW ROUTE ADDED HERE --- */}
              <Route path="faculty-reports" element={<FacultyReportsPage />} />
              <Route path="student-reports" element={<StudentReportsPage />} />
            </Route>
          
          {/* --- PROGRAM COORDINATOR ROUTES --- */}
            <Route path="/coordinator" element={<ProgramCoordinatorDashboard />}>
              <Route index element={<AddStudentPage />} />
              <Route path="add-student" element={<AddStudentPage />} />
              <Route path="manage-courses" element={<ManageCoursesPage />} />
              <Route path="view-attendance" element={<CoordinatorAttendancePage />} />
              <Route path="analytics" element={<CoordinatorAnalytics />} />
            </Route>

          {/* --- STUDENT ROUTES --- */}
            <Route path="/student" element={<StudentDashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;