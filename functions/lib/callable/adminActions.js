"use strict";
/**
 * Admin Actions Callable Function
 * God mode functions for super admin
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminActions = void 0;
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const auth_1 = require("../middleware/auth");
const firestore_1 = require("firebase-admin/firestore");
const firestore_2 = require("../utils/firestore");
const auth_2 = require("../utils/auth");
const zod_1 = require("zod");
const db = (0, firestore_1.getFirestore)();
const adminActionSchema = zod_1.z.object({
    action: zod_1.z.enum([
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
    targetId: zod_1.z.string().optional(),
    data: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.adminActions = (0, https_1.onCall)({
    maxInstances: 10,
    timeoutSeconds: 60,
}, async (request) => {
    const userId = await (0, auth_1.requireGodMode)(request);
    const data = request.data;
    try {
        // Validate input
        const validatedData = adminActionSchema.parse(data);
        // Log admin action
        await (0, firestore_2.logAdminAction)(userId, validatedData.action, {
            targetId: validatedData.targetId,
            data: validatedData.data,
        });
        let result = { success: true };
        switch (validatedData.action) {
            case 'ban_user':
                if (!validatedData.targetId) {
                    throw new https_2.HttpsError('invalid-argument', 'targetId required');
                }
                await db.collection('users').doc(validatedData.targetId).update({
                    banned: true,
                    bannedAt: firestore_1.FieldValue.serverTimestamp(),
                    bannedBy: userId,
                    banReason: validatedData.data?.reason || 'No reason provided',
                });
                result.message = 'User banned successfully';
                break;
            case 'unban_user':
                if (!validatedData.targetId) {
                    throw new https_2.HttpsError('invalid-argument', 'targetId required');
                }
                await db.collection('users').doc(validatedData.targetId).update({
                    banned: false,
                    unbannedAt: firestore_1.FieldValue.serverTimestamp(),
                    unbannedBy: userId,
                });
                result.message = 'User unbanned successfully';
                break;
            case 'delete_user':
                if (!validatedData.targetId) {
                    throw new https_2.HttpsError('invalid-argument', 'targetId required');
                }
                await db.collection('users').doc(validatedData.targetId).delete();
                result.message = 'User deleted successfully';
                break;
            case 'delete_message':
                if (!validatedData.targetId || !validatedData.data?.conversationId) {
                    throw new https_2.HttpsError('invalid-argument', 'targetId and conversationId required');
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
                    throw new https_2.HttpsError('invalid-argument', 'targetId required');
                }
                await db.collection('groups').doc(validatedData.targetId).delete();
                result.message = 'Group deleted successfully';
                break;
            case 'grant_admin':
                if (!validatedData.targetId) {
                    throw new https_2.HttpsError('invalid-argument', 'targetId required');
                }
                const isGodMode = validatedData.data?.godMode === true;
                await (0, auth_2.grantAdminPrivileges)(validatedData.targetId, isGodMode, userId);
                await db.collection('users').doc(validatedData.targetId).update({
                    isAdmin: true,
                    godMode: isGodMode,
                    role: isGodMode ? 'owner' : 'admin',
                    permissions: ['*'],
                    adminGrantedAt: firestore_1.FieldValue.serverTimestamp(),
                    adminGrantedBy: userId,
                });
                result.message = 'Admin privileges granted';
                break;
            case 'revoke_admin':
                if (!validatedData.targetId) {
                    throw new https_2.HttpsError('invalid-argument', 'targetId required');
                }
                await (0, auth_2.revokeAdminPrivileges)(validatedData.targetId, userId);
                await db.collection('users').doc(validatedData.targetId).update({
                    isAdmin: false,
                    godMode: false,
                    role: 'user',
                    permissions: [],
                    adminRevokedAt: firestore_1.FieldValue.serverTimestamp(),
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
                    throw new https_2.HttpsError('invalid-argument', 'flag and value required');
                }
                await db.collection('system').doc('feature_flags').set({
                    [validatedData.data.flag]: validatedData.data.value,
                    updatedAt: firestore_1.FieldValue.serverTimestamp(),
                    updatedBy: userId,
                }, { merge: true });
                result.message = 'Feature flag updated';
                break;
            case 'emergency_shutdown':
                // Set system-wide shutdown flag
                await db.collection('system').doc('status').set({
                    emergencyShutdown: true,
                    shutdownAt: firestore_1.FieldValue.serverTimestamp(),
                    shutdownBy: userId,
                    reason: validatedData.data?.reason || 'Emergency shutdown',
                });
                result.message = 'Emergency shutdown activated';
                break;
            default:
                throw new https_2.HttpsError('invalid-argument', 'Unknown action');
        }
        return result;
    }
    catch (error) {
        console.error('Error in adminActions:', error);
        if (error instanceof https_2.HttpsError) {
            throw error;
        }
        throw new https_2.HttpsError('internal', 'Failed to execute admin action');
    }
});
//# sourceMappingURL=adminActions.js.map