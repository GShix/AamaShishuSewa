// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Dashboard from './pages/user/Dashboard';
import JoinUs from './pages/JoinUs';
import Services from './pages/Services';
import BookService from './pages/BookService';
import BookAppointment from './pages/BookAppointment';
import Contact from './pages/Contact';
import ScrollToTop from './components/common/ScrollToTop';
import ForgotPassword from './pages/ForgetPassword';
import Careers from './pages/Careers';
import Apply from './pages/Apply';
import Leaderboard from './pages/Leaderboard';
import EmployeeDetail from './pages/EmployeeDetail';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import AdminLogin from './pages/admin/Login';
import AdminRegister from './pages/admin/Register';
import AdminPanel from './pages/admin/AdminPanel';

// PWA Components
import InstallPrompt from './components/common/InstallPrompt';
import UpdateNotification from './components/common/UpdateNotification';
import OfflineIndicator from './components/common/OfflineIndicator';
import SplashScreen from './components/common/SplashScreen';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('hasVisited', 'true');
    } else {
      // Skip splash screen for returning visitors
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Show splash screen only on first visit
  if (showSplash && isFirstVisit) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

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

  // Public Route (redirect if already logged in - use for Auth pages like Login/Register)
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

  // Admin Protected Route
  const AdminProtectedRoute = ({ children }) => {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const checkAdminAuth = () => {
        const adminToken = localStorage.getItem('adminToken');
        const adminUser = localStorage.getItem('adminUser');
        
        if (adminToken && adminUser) {
          try {
            const user = JSON.parse(adminUser);
            if (user.role === 'admin' || user.role === 'superAdmin') {
              setIsAdminAuthenticated(true);
            }
          } catch (error) {
            console.error('Error parsing admin user:', error);
          }
        }
        setLoading(false);
      };

      checkAdminAuth();
    }, []);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    return isAdminAuthenticated ? children : <Navigate to="/admin/login" />;
  };

  return (
    <Router>
      <ScrollToTop/>
      <Routes>
        {/* --- TRULY PUBLIC ROUTES (Accessible to everyone) --- */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Career pages should be accessible to both logged-in and guest users */}
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers/apply" element={<Apply />} />

        {/* Leaderboard */}
        {/* <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/employee_profile/:id" element={<EmployeeDetail />} /> */}

        {/* --- AUTH REDIRECT ROUTES (Redirects to dashboard if logged in) --- */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forget_password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/join_us" element={<PublicRoute><JoinUs /></PublicRoute>} />
        {/* <Route path="/book" element={<PublicRoute><BookService /></PublicRoute>} /> */}

        {/* --- PROTECTED ROUTES (Requires login) --- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-appointment"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        {/* --- EMPLOYEE ROUTES (Protected) --- */}
        <Route
          path="/employee/dashboard"
          element={
            // <ProtectedRoute>
              <EmployeeDashboard />
            // </ProtectedRoute>
          }
        />

        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* <Route path="/admin/register" element={<AdminRegister />} /> */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminPanel />
            </AdminProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <InstallPrompt />
      <UpdateNotification />
      <OfflineIndicator />
      <AppContent />
    </AuthProvider>
  );
}

export default App;