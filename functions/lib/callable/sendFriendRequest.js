"use strict";
/**
 * Send Friend Request Callable Function
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFriendRequest = void 0;
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const auth_1 = require("../middleware/auth");
const rateLimit_1 = require("../middleware/rateLimit");
const validation_1 = require("../utils/validation");
const firestore_1 = require("firebase-admin/firestore");
const notification_1 = require("../utils/notification");
const uuid_1 = require("uuid");
const db = (0, firestore_1.getFirestore)();
exports.sendFriendRequest = (0, https_1.onCall)({
    maxInstances: 50,
    timeoutSeconds: 30,
}, async (request) => {
    const userId = await (0, auth_1.verifyAuth)(request);
    const data = request.data;
    try {
        // Rate limiting
        await (0, rateLimit_1.rateLimitFriendRequest)(userId);
        // Validate input
        const validatedData = (0, validation_1.validate)(validation_1.friendRequestSchema, data);
        if (validatedData.friendId === userId) {
            throw new https_2.HttpsError('invalid-argument', 'Cannot send friend request to yourself');
        }
        // Check if friend request already exists
        const existingRequest = await db
            .collection('friends')
            .where('userId', '==', userId)
            .where('friendId', '==', validatedData.friendId)
            .limit(1)
            .get();
        if (!existingRequest.empty) {
            const existing = existingRequest.docs[0].data();
            if (existing.status === 'accepted') {
                throw new https_2.HttpsError('already-exists', 'Already friends');
            }
            if (existing.status === 'pending') {
                throw new https_2.HttpsError('already-exists', 'Friend request already sent');
            }
        }
        // Create friend request
        const friendRequestId = (0, uuid_1.v4)();
        await db.collection('friends').doc(friendRequestId).set({
            id: friendRequestId,
            userId,
            friendId: validatedData.friendId,
            status: 'pending',
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        });
        // Send notification
        const userDoc = await db.collection('users').doc(userId).get();
        const userName = userDoc.data()?.displayName || 'Someone';
        await (0, notification_1.sendPushNotification)(validatedData.friendId, 'New Friend Request', `${userName} wants to be your friend`, {
            type: 'friend_request',
            friendRequestId,
            userId,
        });
        return {
            success: true,
            friendRequestId,
        };
    }
    catch (error) {
        console.error('Error in sendFriendRequest:', error);
        if (error instanceof https_2.HttpsError) {
            throw error;
        }
        throw new https_2.HttpsError('internal', 'Failed to send friend request');
    }
});
//# sourceMappingURL=sendFriendRequest.js.map