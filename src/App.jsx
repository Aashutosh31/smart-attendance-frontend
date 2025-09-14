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
import AttendanceSessionPage from "./components/AttendanceSessionPage.jsx";
import ManageCoursesPage from "./components/ManageCoursesPage.jsx";
import CoordinatorAnalytics from "./components/CoordinatorAnalytics.jsx";


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
          {/* <Route element={<ProtectedRoute allowedRoles={['faculty']} />}> */}
            <Route path="/verify" element={<FacultyVerificationPage />} />
            <Route path="/" element={<FacultyDashboard />}>
              <Route index element={<DashboardOverview />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/:courseId/attendance" element={<AttendanceSessionPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          {/* </Route> */}

          {/* --- ADMIN ROUTES --- */}
          {/* <Route element={<ProtectedRoute allowedRoles={['admin']} />}> */}
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<ManageFacultyPage />} />
              <Route path="manage-faculty" element={<ManageFacultyPage />} />
              <Route path="manage-students" element={<ManageStudentsPage />} />
               <Route path="analytics" element={<AdminAnalyticsPage />} />
               <Route path="manage-courses" element={<ManageCoursesPage />} />
            </Route>
          {/* </Route> */}

          {/* --- HOD ROUTES --- */}
          {/* <Route element={<ProtectedRoute allowedRoles={['hod']} />}> */}
            <Route path="/hod" element={<HodDashboard />}>
              <Route index element={<FacultyAttendancePage />} />
              <Route path="faculty-attendance" element={<FacultyAttendancePage />} />
              <Route path="student-reports" element={<StudentReportsPage />} />
            </Route>
          {/* </Route> */}
          
          {/* --- PROGRAM COORDINATOR ROUTES --- */}
          {/* <Route element={<ProtectedRoute allowedRoles={['program_coordinator']} />}> */}
            <Route path="/coordinator" element={<ProgramCoordinatorDashboard />}>
              <Route index element={<AddStudentPage />} />
              <Route path="add-student" element={<AddStudentPage />} />
               <Route path="view-attendance" element={<CoordinatorAttendancePage />} />
            <Route path="analytics" element={<CoordinatorAnalytics />} />
            </Route>
          {/* </Route> */}

          {/* --- STUDENT ROUTES --- */}
          {/* <Route element={<ProtectedRoute allowedRoles={['student']} />}> */}
            <Route path="/student" element={<StudentDashboard />} />
          {/* </Route> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;