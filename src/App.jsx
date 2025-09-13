import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Core Components
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./components/LoginPage.jsx";
import UnauthorizedPage from "./components/UnauthorizedPage.jsx";

// Layouts
import AdminDashboard from "./components/AdminDashboard.jsx";
import FacultyDashboard from "./components/Dashboard.jsx";
import HodDashboard from "./components/HodDashboard.jsx";
import StudentDashboard from "./components/StudentDashboard.jsx";

// Faculty Pages
import DashboardOverview from "./components/DashboardOverview.jsx";
import CoursesPage from "./components/CoursesPage.jsx";
import AnalyticsPage from "./components/AnalyticsPage.jsx";
import SettingsPage from "./components/SettingsPage.jsx";
import FacultyVerificationPage from "./components/FacultyVerificationPage.jsx";

// (Create placeholder files for these new pages)
const ManageFaculty = () => <div>Manage Faculty Page</div>;
const ManageStudents = () => <div>Manage Students Page</div>;
const FacultyAttendance = () => <div>Faculty Attendance Page</div>;
const StudentReports = () => <div>Student Reports Page</div>;

import "./index.css";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="light" />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* --- FACULTY ROUTES --- */}
         {/* <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>*/}
            <Route path="/verify" element={<FacultyVerificationPage />} />
            <Route path="/faculty" element={<FacultyDashboard />}>
              <Route index element={<DashboardOverview />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          {/*</Route>*/}
          {/* --- ADMIN ROUTES --- */}
          {/*<Route element={<ProtectedRoute allowedRoles={['admin']} />}>}*/}
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<ManageFaculty />} />
              <Route path="manage-faculty" element={<ManageFaculty />} />
              <Route path="manage-students" element={<ManageStudents />} />
            </Route>
          {/*</Route>*/}

          {/* --- HOD ROUTES --- */}
          {/* <Route element={<ProtectedRoute allowedRoles={['hod']} />}> */}
            <Route path="/hod" element={<HodDashboard />}>
              <Route index element={<FacultyAttendance />} />
              <Route path="faculty-attendance" element={<FacultyAttendance />} />
              <Route path="student-reports" element={<StudentReports />} />
            </Route>
            {/* </Route> */}

          {/* --- STUDENT ROUTES --- */}
          {/* <Route element={<ProtectedRoute allowedRoles={['student']} />}> */}
            <Route path="/student" element={<StudentDashboard />} />
            {/* You can add more student-specific pages here later */}
         { /* </Route> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;