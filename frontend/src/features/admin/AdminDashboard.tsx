/**
 * Admin Dashboard Component
 * Only accessible to users with isAdmin: true
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { ROUTES } from '../../lib/constants';
import { isAdmin } from '../../lib/utils';

function AdminDashboard() {
  const { user, userData, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin(userData))) {
      navigate(ROUTES.HOME);
    }
  }, [user, userData, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!user || !isAdmin(userData)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <div className="flex-none">
          <a href={ROUTES.CHAT} className="btn btn-sm btn-ghost">
            Quay lại
          </a>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Total Users</div>
            <div className="stat-value">0</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Active Users</div>
            <div className="stat-value">0</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Messages Today</div>
            <div className="stat-value">0</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Pending Reports</div>
            <div className="stat-value">0</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">👑 Admin Dashboard</h2>
            <p>Chào mừng đến Admin Panel!</p>
            {userData?.godMode && (
              <div className="alert alert-warning mt-4">
                <span>⚡ GOD MODE: Bạn có toàn quyền truy cập hệ thống</span>
              </div>
            )}
            <div className="mt-4">
              <p className="text-sm text-base-content/70">
                Email: {userData?.email}
              </p>
              <p className="text-sm text-base-content/70">
                Role: {userData?.role || 'user'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

