import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Context
import { useAuth } from './context/AuthContext';

// Components
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ApplyLeave from './pages/ApplyLeave';
import ManageLeaves from './pages/ManageLeaves';
import Analytics from './pages/Analytics';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, loading } = useAuth();
  
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    style={{ minHeight: '100%' }}
  >
    {children}
  </motion.div>
);

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#181818',
          color: '#fff',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px'
        }
      }} />

      {isAuthenticated && <Sidebar />}

      <main style={{ 
        flex: 1, 
        marginLeft: isAuthenticated ? 'var(--sidebar-width)' : 0,
        transition: 'margin-left 0.3s ease',
        height: '100vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<Login />} />
            
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <PageTransition><Dashboard /></PageTransition>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/apply" 
              element={
                <ProtectedRoute allowedRoles={['Employee']}>
                  <PageTransition><ApplyLeave /></PageTransition>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/manage" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                  <PageTransition><ManageLeaves /></PageTransition>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                  <PageTransition><Analytics /></PageTransition>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/attendance" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Employee']}>
                  <PageTransition><Attendance /></PageTransition>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/employees" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                  <PageTransition><Employees /></PageTransition>
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
