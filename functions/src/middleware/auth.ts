/**
 * Authentication Middleware for Cloud Functions
 */

import { HttpsError } from 'firebase-functions/v2/https';
import { verifyIdToken } from '../utils/auth';
import { isAdmin, isGodMode } from '../utils/firestore';

/**
 * Verify authentication token
 */
export async function verifyAuth(context: any): Promise<string> {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  return context.auth.uid;
}

/**
 * Verify admin access
 */
export async function verifyAdmin(userId: string): Promise<void> {
  const admin = await isAdmin(userId);
  if (!admin) {
    throw new HttpsError('permission-denied', 'Admin access required');
  }
}

/**
 * Verify god mode access
 */
export async function verifyGodMode(userId: string): Promise<void> {
  const god = await isGodMode(userId);
  if (!god) {
    throw new HttpsError('permission-denied', 'God mode access required');
  }
}

/**
 * Middleware wrapper for authenticated functions
 */
export function requireAuth<T extends any[]>(
  handler: (userId: string, ...args: T) => Promise<any>
) {
  return async (data: any, context: any) => {
    const userId = await verifyAuth(context);
    return handler(userId, data);
  };
}

/**
 * Middleware wrapper for admin-only functions
 */
export function requireAdmin<T extends any[]>(
  handler: (userId: string, ...args: T) => Promise<any>
) {
  return async (data: any, context: any) => {
    const userId = await verifyAuth(context);
    await verifyAdmin(userId);
    return handler(userId, data);
  };
}

/**
 * Middleware wrapper for god mode functions
 */
export function requireGodMode<T extends any[]>(
  handler: (userId: string, ...args: T) => Promise<any>
) {
  return async (data: any, context: any) => {
    const userId = await verifyAuth(context);
    await verifyGodMode(userId);
    return handler(userId, data);
  };
}

