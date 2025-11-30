/**
 * Auth Store (Zustand)
 */

import { create } from 'zustand';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getDocument, updateDocument } from '../lib/firestore';
import { SUPER_ADMIN_EMAIL } from '../lib/constants';

interface UserData {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  isAdmin?: boolean;
  godMode?: boolean;
  role?: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setUserData: (userData: UserData | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => void;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userData: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),

  setUserData: (userData) => set({ userData }),

  setLoading: (loading) => set({ loading }),

  initialize: () => {
    if (get().initialized) return;

    onAuthStateChanged(auth, async (user) => {
      set({ user, loading: false, initialized: true });

      if (user) {
        // Load user data from Firestore
        try {
          const userData = await getDocument<UserData>('users', user.uid);
          
          // CRITICAL: Check if this is super admin email
          if (user.email === SUPER_ADMIN_EMAIL && userData) {
            // Ensure admin flags are set (in case trigger didn't run)
            if (!userData.isAdmin || !userData.godMode) {
              await updateDocument('users', user.uid, {
                isAdmin: true,
                godMode: true,
                role: 'owner',
                permissions: ['*'],
              });
              // Reload user data
              const updatedData = await getDocument<UserData>('users', user.uid);
              set({ userData: updatedData });
            } else {
              set({ userData });
            }
          } else {
            set({ userData });
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          set({ userData: null });
        }
      } else {
        set({ userData: null });
      }
    });
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null, userData: null });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  refreshUserData: async () => {
    const user = get().user;
    if (!user) return;

    try {
      const userData = await getDocument<UserData>('users', user.uid);
      set({ userData });
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  },
}));

