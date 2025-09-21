import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthStore';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoginPage from './components/Auth/LoginPage';
import CollegeRegistrationPage from './components/Auth/CollegeRegistrationPage';
import UnauthorizedPage from './components/Auth/UnauthorizedPage';

// Lazy load the role-specific dashboards
const AdminDashboard = React.lazy(() => import('./components/Admin/AdminDashboard'));
const HodDashboard = React.lazy(() => import('./components/HOD/HodDashboard'));
const FacultyDashboard = React.lazy(() => import('./components/Faculty/Dashboard'));
const StudentDashboard = React.lazy(() => import('./components/Student/StudentDashboard'));
const ProgramCoordinator = React.lazy(() => import('./components/Coordinator/ProgramCoordinator'));

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Suspense provides a fallback UI while lazy-loaded components are loading */}
        <React.Suspense fallback={<div>Loading page...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<CollegeRegistrationPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hod/*" 
              element={
                <ProtectedRoute roles={['hod']}>
                  <HodDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/faculty/*" 
              element={
                <ProtectedRoute roles={['faculty']}>
                  <FacultyDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/*" 
              element={
                <ProtectedRoute roles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
             <Route 
              path="/coordinator/*" 
              element={
                <ProtectedRoute roles={['coordinator']}>
                  <ProgramCoordinator />
                </ProtectedRoute>
              } 
            />

            {/* Default route could redirect to login or a homepage */}
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </React.Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;