/**
 * Authentication Utility Functions
 */

import { getAuth } from 'firebase-admin/auth';
import { logAdminAction } from './firestore';

const auth = getAuth();

/**
 * Set custom claims for user (admin, godMode, etc.)
 */
export async function setCustomClaims(
  userId: string,
  claims: {
    admin?: boolean;
    godMode?: boolean;
    role?: string;
    permissions?: string[];
  }
) {
  try {
    await auth.setCustomUserClaims(userId, claims);
    console.log(`Custom claims set for user ${userId}:`, claims);
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw error;
  }
}

/**
 * Grant admin privileges to user
 */
export async function grantAdminPrivileges(
  userId: string,
  isGodMode: boolean = false,
  grantedBy?: string
) {
  try {
    const claims = {
      admin: true,
      godMode: isGodMode,
      role: isGodMode ? 'owner' : 'admin',
      permissions: ['*'],
    };

    await setCustomClaims(userId, claims);

    // Log admin action if granted by another admin
    if (grantedBy) {
      await logAdminAction(grantedBy, 'grant_admin', {
        targetUserId: userId,
        isGodMode,
      });
    }

    return claims;
  } catch (error) {
    console.error('Error granting admin privileges:', error);
    throw error;
  }
}

/**
 * Revoke admin privileges
 */
export async function revokeAdminPrivileges(userId: string, revokedBy?: string) {
  try {
    const claims = {
      admin: false,
      godMode: false,
      role: 'user',
      permissions: [],
    };

    await setCustomClaims(userId, claims);

    if (revokedBy) {
      await logAdminAction(revokedBy, 'revoke_admin', {
        targetUserId: userId,
      });
    }

    return claims;
  } catch (error) {
    console.error('Error revoking admin privileges:', error);
    throw error;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  try {
    const user = await auth.getUserByEmail(email);
    return user;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      return null;
    }
    throw error;
  }
}

/**
 * Verify ID token
 */
export async function verifyIdToken(token: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw error;
  }
}

