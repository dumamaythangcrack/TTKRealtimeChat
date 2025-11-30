/**
 * Chat List Component
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { ROUTES } from '../../lib/constants';
import { Link } from 'react-router-dom';

function ChatList() {
  const { user, userData, signOut } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <h1 className="text-xl font-bold">ChatTTK</h1>
        </div>
        <div className="flex-none gap-2">
          {userData?.isAdmin && (
            <Link to={ROUTES.ADMIN} className="btn btn-sm btn-primary">
              Admin Panel
            </Link>
          )}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                {userData?.displayName?.charAt(0) || 'U'}
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Profile</a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a onClick={handleSignOut}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Chào mừng đến ChatTTK!</h2>
            <p>Bạn đã đăng nhập thành công.</p>
            {userData?.isAdmin && (
              <div className="alert alert-success mt-4">
                <span>👑 Bạn có quyền ADMIN!</span>
              </div>
            )}
            {userData?.godMode && (
              <div className="alert alert-warning mt-2">
                <span>⚡ GOD MODE đã được kích hoạt!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatList;

