/**
 * Register Component
 * CRITICAL: Auto admin grant happens in onUserCreate trigger
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { db } from '../../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ROUTES, SUPER_ADMIN_EMAIL } from '../../lib/constants';
import { useAuthStore } from '../../stores/useAuthStore';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const refreshUserData = useAuthStore((state) => state.refreshUserData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      // NOTE: onUserCreate trigger will automatically grant admin if email matches SUPER_ADMIN_EMAIL
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: displayName || user.email?.split('@')[0] || 'User',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isAdmin: false, // Will be updated by trigger if email matches
        godMode: false,
        role: 'user',
        permissions: [],
        stats: {
          messagesSent: 0,
          callsMade: 0,
          storiesCreated: 0,
          friendsCount: 0,
          coins: 0,
          level: 1,
          xp: 0,
        },
      });

      // Wait a bit for trigger to complete
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Refresh user data to get admin status
      await refreshUserData();

      // Show success message if admin
      if (email === SUPER_ADMIN_EMAIL) {
        alert('🎉 Bạn đã được cấp quyền SUPER ADMIN (GOD MODE)!');
      }

      navigate(ROUTES.CHAT);
    } catch (err: any) {
      console.error('Register error:', err);
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Đăng ký ChatTTK</h2>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Tên hiển thị</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="Tên của bạn"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Mật khẩu</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Đang đăng ký...
                </>
              ) : (
                'Đăng ký'
              )}
            </button>
          </form>

          <div className="divider">HOẶC</div>

          <div className="text-center">
            <p className="text-sm">
              Đã có tài khoản?{' '}
              <Link to={ROUTES.LOGIN} className="link link-primary">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

