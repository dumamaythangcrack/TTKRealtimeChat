/**
 * Admin Actions Callable Function
 * God mode functions for super admin
 */

import { onCall } from 'firebase-functions/v2/https';
import { HttpsError } from 'firebase-functions/v2/https';
import { requireGodMode, requireAdmin } from '../middleware/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { logAdminAction } from '../utils/firestore';
import { grantAdminPrivileges, revokeAdminPrivileges } from '../utils/auth';
import { z } from 'zod';

const db = getFirestore();

const adminActionSchema = z.object({
  action: z.enum([
    'ban_user',
    'unban_user',
    'delete_user',
    'delete_message',
    'delete_group',
    'grant_admin',
    'revoke_admin',
    'broadcast_notification',
    'set_feature_flag',
    'emergency_shutdown',
  ]),
  targetId: z.string().optional(),
  data: z.record(z.any()).optional(),
});

export const adminActions = onCall(
  {
    maxInstances: 10,
    timeoutSeconds: 60,
  },
  async (request) => {
    const userId = await requireGodMode(request);
    const data = request.data;

    try {
      // Validate input
      const validatedData = adminActionSchema.parse(data);

      // Log admin action
      await logAdminAction(userId, validatedData.action, {
        targetId: validatedData.targetId,
        data: validatedData.data,
      });

      let result: any = { success: true };

      switch (validatedData.action) {
        case 'ban_user':
          if (!validatedData.targetId) {
            throw new HttpsError('invalid-argument', 'targetId required');
          }
          await db.collection('users').doc(validatedData.targetId).update({
            banned: true,
            bannedAt: FieldValue.serverTimestamp(),
            bannedBy: userId,
            banReason: validatedData.data?.reason || 'No reason provided',
          });
          result.message = 'User banned successfully';
          break;

        case 'unban_user':
          if (!validatedData.targetId) {
            throw new HttpsError('invalid-argument', 'targetId required');
          }
          await db.collection('users').doc(validatedData.targetId).update({
            banned: false,
            unbannedAt: FieldValue.serverTimestamp(),
            unbannedBy: userId,
          });
          result.message = 'User unbanned successfully';
          break;

        case 'delete_user':
          if (!validatedData.targetId) {
            throw new HttpsError('invalid-argument', 'targetId required');
          }
          await db.collection('users').doc(validatedData.targetId).delete();
          result.message = 'User deleted successfully';
          break;

        case 'delete_message':
          if (!validatedData.targetId || !validatedData.data?.conversationId) {
            throw new HttpsError('invalid-argument', 'targetId and conversationId required');
          }
          await db
            .collection('conversations')
            .doc(validatedData.data.conversationId)
            .collection('messages')
            .doc(validatedData.targetId)
            .delete();
          result.message = 'Message deleted successfully';
          break;

        case 'delete_group':
          if (!validatedData.targetId) {
            throw new HttpsError('invalid-argument', 'targetId required');
          }
          await db.collection('groups').doc(validatedData.targetId).delete();
          result.message = 'Group deleted successfully';
          break;

        case 'grant_admin':
          if (!validatedData.targetId) {
            throw new HttpsError('invalid-argument', 'targetId required');
          }
          const isGodMode = validatedData.data?.godMode === true;
          await grantAdminPrivileges(validatedData.targetId, isGodMode, userId);
          await db.collection('users').doc(validatedData.targetId).update({
            isAdmin: true,
            godMode: isGodMode,
            role: isGodMode ? 'owner' : 'admin',
            permissions: ['*'],
            adminGrantedAt: FieldValue.serverTimestamp(),
            adminGrantedBy: userId,
          });
          result.message = 'Admin privileges granted';
          break;

        case 'revoke_admin':
          if (!validatedData.targetId) {
            throw new HttpsError('invalid-argument', 'targetId required');
          }
          await revokeAdminPrivileges(validatedData.targetId, userId);
          await db.collection('users').doc(validatedData.targetId).update({
            isAdmin: false,
            godMode: false,
            role: 'user',
            permissions: [],
            adminRevokedAt: FieldValue.serverTimestamp(),
            adminRevokedBy: userId,
          });
          result.message = 'Admin privileges revoked';
          break;

        case 'broadcast_notification':
          // This would send notification to all users
          // Implementation would use FCM topic or batch send
          result.message = 'Broadcast notification queued';
          break;

        case 'set_feature_flag':
          if (!validatedData.data?.flag || validatedData.data?.value === undefined) {
            throw new HttpsError('invalid-argument', 'flag and value required');
          }
          await db.collection('system').doc('feature_flags').set(
            {
              [validatedData.data.flag]: validatedData.data.value,
              updatedAt: FieldValue.serverTimestamp(),
              updatedBy: userId,
            },
            { merge: true }
          );
          result.message = 'Feature flag updated';
          break;

        case 'emergency_shutdown':
          // Set system-wide shutdown flag
          await db.collection('system').doc('status').set({
            emergencyShutdown: true,
            shutdownAt: FieldValue.serverTimestamp(),
            shutdownBy: userId,
            reason: validatedData.data?.reason || 'Emergency shutdown',
          });
          result.message = 'Emergency shutdown activated';
          break;

        default:
          throw new HttpsError('invalid-argument', 'Unknown action');
      }

      return result;
    } catch (error: any) {
      console.error('Error in adminActions:', error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError('internal', 'Failed to execute admin action');
    }
  }
);

