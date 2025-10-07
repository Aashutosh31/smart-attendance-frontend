import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- STATE MANAGEMENT ---
import { useAuthStore } from "./store/AuthStore";

// --- CORE & AUTH COMPONENTS ---
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import LoginPage from "./components/Auth/LoginPage.jsx";
import UnauthorizedPage from "./components/Auth/UnauthorizedPage.jsx";
import CollegeRegistrationPage from "./components/Auth/CollegeRegistrationPage.jsx";
import RoleBasedRedirect from "./components/Auth/RoleBasedRedirect.jsx";
import FaceEnrollmentPage from "./components/Auth/FaceEnrollmentPage.jsx";

// --- LAYOUTS / DASHBOARDS ---
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import FacultyDashboard from "./components/Faculty/Dashboard.jsx";
import HodDashboard from "./components/HOD/HodDashboard.jsx";
import StudentDashboard from "./components/Student/StudentDashboard.jsx";
import ProgramCoordinatorDashboard from "./components/Coordinator/ProgramCoordinator.jsx";

// --- HOD SPECIFIC PAGES ---
import HodOverviewPage from "./components/HOD/HodOverviewPage.jsx";
import ManageFaculty from "./components/HOD/ManageFaculty.jsx";
import ManageCoordinators from "./components/HOD/ManageCoordinators.jsx";
import ManageCoursesPage from "./components/HOD/ManageCoursesPage.jsx";
import StudentsReportPage from "./components/HOD/StudentsReportPage.jsx";
import FacultyReportsPage from "./components/HOD/FacultyReportsPage.jsx";
import FacultyAttendancePage from "./components/HOD/FacultyAttendancePage.jsx";

// --- ADMIN SPECIFIC PAGES ---
import ViewStudents from "./components/Admin/ViewStudents.jsx";
import ManageHods from "./components/Admin/ManageHods.jsx";
import AdminReportsPage from "./components/Admin/AdminReportsPage.jsx";
import AdminAnalyticsPage from "./components/Admin/AdminAnalyticsPage.jsx";

// --- FACULTY SPECIFIC PAGES ---
import DashboardOverview from "./components/Faculty/DashboardOverview.jsx";
import CoursesPage from "./components/Faculty/CoursesPage.jsx";
import AnalyticsPage from "./components/Faculty/AnalyticsPage.jsx";

// --- COORDINATOR SPECIFIC PAGES ---
import AddStudentPage from "./components/Coordinator/AddStudentPage.jsx";
import CoordinatorAttendancePage from "./components/Coordinator/CoordinatorAttendancePage.jsx";
import CoordinatorAnalytics from "./components/Coordinator/CoordinatorAnalytics.jsx";

// --- VERIFICATION PAGES ---
import AdminVerificationPage from "./components/Admin/AdminVerificationPage.jsx";
import HodVerificationPage from "./components/HOD/HodVerificationPage.jsx";
import FacultyVerificationPage from "./components/Faculty/FacultyVerificationPage.jsx";
import StudentVerificationPage from "./components/Student/StudentVerificationPage.jsx";

// --- SHARED PAGES ---
import SettingsPage from "./components/Shared/SettingsPage.jsx";

function App() {
  // --- THE FIX: Get the 'loading' state and 'initialize' function from your store ---
  const { initializeSession, loading } = useAuthStore();

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // --- THE FIX: While the session is being initialized, show a loading screen ---
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
        <h2 style={{ color: '#333' }}>Loading...</h2>
      </div>
    );
  }

  // --- Once loading is false, render the full application ---
  return (
    <>
      <ToastContainer autoClose={3000} hideProgressBar />
      <Router>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-college" element={<CollegeRegistrationPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          <Route
            path="/enroll-face"
            element={
              <ProtectedRoute>
                <FaceEnrollmentPage />
              </ProtectedRoute>
            }
          />

          {/* --- PROTECTED ROUTES --- */}
          <Route path="/" element={<ProtectedRoute><RoleBasedRedirect /></ProtectedRoute>} />

          {/* 1. Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}>
            <Route path="view-students" element={<ViewStudents />} />
            <Route path="manage-hods" element={<ManageHods />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="/admin/verify" element={<ProtectedRoute allowedRoles={['admin']}><AdminVerificationPage /></ProtectedRoute>} />
          
          {/* 2. HOD Routes */}
          <Route path="/hod" element={<ProtectedRoute allowedRoles={['hod']}><HodDashboard /></ProtectedRoute>}>
            <Route path="overview" element={<HodOverviewPage />} />
            <Route path="faculty" element={<ManageFaculty />} />
            <Route path="coordinators" element={<ManageCoordinators />} />
            <Route path="courses" element={<ManageCoursesPage />} />
            <Route path="student-reports" element={<StudentsReportPage />} />
             <Route path="students" element={<ViewStudents />} />
            <Route path="reports" element={<FacultyReportsPage />} />
            <Route path="faculty-attendance" element={<FacultyAttendancePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="/hod/verify" element={<ProtectedRoute allowedRoles={['hod']}><HodVerificationPage /></ProtectedRoute>} />
          
          {/* 3. Faculty Routes */}
          <Route path="/faculty" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>}>
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="/faculty/verify" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyVerificationPage /></ProtectedRoute>} />
          
          {/* 4. Student Routes */}
          <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/verify" element={<ProtectedRoute allowedRoles={['student']}><StudentVerificationPage /></ProtectedRoute>} />
          
          {/* 5. Program Coordinator Routes */}
          <Route path="/coordinator" element={<ProtectedRoute allowedRoles={['coordinator']}><ProgramCoordinatorDashboard /></ProtectedRoute>}>
            <Route index element={<AddStudentPage />} />
            <Route path="add-student" element={<AddStudentPage />} />
            <Route path="manage-courses" element={<ManageCoursesPage />} />
            <Route path="view-attendance" element={<CoordinatorAttendancePage />} />
            <Route path="coordinator-analytics" element={<CoordinatorAnalytics />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;