// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JoinUs from './pages/JoinUs';
import Services from './pages/Services';
import BookService from './pages/BookService';
import Contact from './pages/Contact';
import ScrollToTop from './components/common/ScrollToTop';
import ForgotPassword from './pages/ForgetPassword';
import Careers from './pages/Careers';
import JobOpenings from './pages/JobOpening';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function AppContent() {
  return (
    <Router>
      <ScrollToTop/>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route 
          path="/services" 
          element={
            <PublicRoute>
              <Services />
            </PublicRoute>
          } 
        />
        <Route 
          path="/join_us" 
          element={
            <PublicRoute>
              <JoinUs />
            </PublicRoute>
          } 
        />
        <Route 
          path="/job_openings" 
          element={
            <PublicRoute>
              <JobOpenings />
            </PublicRoute>
          } 
        />
        <Route 
          path="/careers" 
          element={
            <PublicRoute>
              <Careers />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/forget_password" 
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        <Route 
          path="/book" 
          element={
            <PublicRoute>
              <BookService />
            </PublicRoute>
          } 
        />
        <Route 
          path="/contact" 
          element={
            <PublicRoute>
              <Contact />
            </PublicRoute>
          } 
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;