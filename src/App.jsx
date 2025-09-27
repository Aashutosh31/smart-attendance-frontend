// File Path: src/App.jsx
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

// --- VERIFICATION PAGES ---
import AdminVerificationPage from "./components/Admin/AdminVerificationPage.jsx";
import HodVerificationPage from "./components/HOD/HodVerificationPage.jsx";
import FacultyVerificationPage from "./components/Faculty/FacultyVerificationPage.jsx";
import StudentVerificationPage from "./components/Student/StudentVerificationPage.jsx";


// --- OTHER PAGES ---
import DashboardOverview from "./components/Faculty/DashboardOverview.jsx";
import CoursesPage from "./components/Faculty/CoursesPage.jsx";
import AnalyticsPage from "./components/Faculty/AnalyticsPage.jsx";
import AdminReportsPage from "./components/Admin/AdminReportsPage.jsx";
import ManageFacultyPage from "./components/Admin/ManageFaculty.jsx";
import AdminAnalyticsPage from "./components/Admin/AdminAnalyticsPage.jsx";
import ManageHodsPage from "./components/Admin/ManageHods.jsx";
import ViewStudentsPage from "./components/Admin/ViewStudents.jsx";
import FacultyAttendancePage from "./components/HOD/FacultyAttendancePage.jsx";
import ManageCoordinatorsPage from "./components/HOD/ManageCoordinators.jsx";
import ManageCoursesPage from "./components/HOD/ManageCoursesPage.jsx";
import FacultyReportsPage from "./components/HOD/FacultyReportsPage.jsx";
import StudentReportsPage from "./components/HOD/StudentsReportPage.jsx";
import AddStudentPage from "./components/Coordinator/AddStudentPage.jsx";
import CoordinatorAttendancePage from "./components/Coordinator/CoordinatorAttendancePage.jsx";
import CoordinatorAnalytics from "./components/Coordinator/CoordinatorAnalytics.jsx";
import SettingsPage from "./components/Shared/SettingsPage.jsx";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Router>
        <Routes>
          {/* --- PUBLIC & AUTH ROUTES --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-college" element={<CollegeRegistrationPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/" element={<ProtectedRoute><RoleBasedRedirect /></ProtectedRoute>} />

          {/* --- PROTECTED ROUTES WITH VERIFICATION LOGIC --- */}
          
          {/* 1. Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}>
            <Route index element={<AdminAnalyticsPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="manage-hods" element={<ManageHodsPage />} />
            <Route path="manage-faculty" element={<ManageFacultyPage />} />
            <Route path="view-students" element={<ViewStudentsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="/admin/verify" element={<ProtectedRoute allowedRoles={['admin']}><AdminVerificationPage /></ProtectedRoute>} />

          {/* 2. HOD Routes */}
          <Route path="/hod" element={<ProtectedRoute allowedRoles={['hod']}><HodDashboard /></ProtectedRoute>}>
            <Route index element={<FacultyAttendancePage />} />
            <Route path="faculty-attendance" element={<FacultyAttendancePage />} />
            <Route path="manage-coordinators" element={<ManageCoordinatorsPage />} />
            <Route path="manage-courses" element={<ManageCoursesPage />} />
            <Route path="manage-faculty" element={<ManageFacultyPage />} />
            <Route path="faculty-reports" element={<FacultyReportsPage />} />
            <Route path="student-reports" element={<StudentReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="/hod/verify" element={<ProtectedRoute allowedRoles={['hod']}><HodVerificationPage /></ProtectedRoute>} />
          
          {/* 3. Faculty Routes */}
          <Route path="/faculty" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>}>
            <Route index element={<DashboardOverview />} />
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="/faculty/verify" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyVerificationPage /></ProtectedRoute>} />
          
          {/* 4. Student Routes */}
          <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/verify" element={<ProtectedRoute allowedRoles={['student']}><StudentVerificationPage /></ProtectedRoute>} />
          
          {/* 5. Program Coordinator Routes (No verification needed for this role) */}
          <Route path="/coordinator" element={<ProtectedRoute allowedRoles={['program_coordinator']}><ProgramCoordinatorDashboard /></ProtectedRoute>}>
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