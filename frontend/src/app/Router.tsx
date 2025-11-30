/**
 * App Router
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { ROUTES } from '../lib/constants';
import { isAdmin } from '../lib/utils';

// Lazy load components (for code splitting)
import { lazy, Suspense } from 'react';

const Login = lazy(() => import('../features/auth/Login'));
const Register = lazy(() => import('../features/auth/Register'));
const ChatList = lazy(() => import('../features/chat/ChatList'));
const AdminDashboard = lazy(() => import('../features/admin/AdminDashboard'));

// Loading component
function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loading loading-spinner loading-lg"></div>
    </div>
  );
}

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}

// Admin Route component
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuthStore();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!isAdmin(userData)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        {/* Protected routes */}
        <Route
          path={ROUTES.CHAT}
          element={
            <ProtectedRoute>
              <ChatList />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path={ROUTES.ADMIN}
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to={ROUTES.CHAT} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.CHAT} replace />} />
      </Routes>
    </Suspense>
  );
}

export default Router;

