/**
 * Send Friend Request Callable Function
 */

import { onCall } from 'firebase-functions/v2/https';
import { HttpsError } from 'firebase-functions/v2/https';
import { verifyAuth } from '../middleware/auth';
import { rateLimitFriendRequest } from '../middleware/rateLimit';
import { validate, friendRequestSchema } from '../utils/validation';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { sendPushNotification } from '../utils/notification';
import { v4 as uuidv4 } from 'uuid';

const db = getFirestore();

export const sendFriendRequest = onCall(
  {
    maxInstances: 50,
    timeoutSeconds: 30,
  },
  async (request) => {
    const userId = await verifyAuth(request);
    const data = request.data;

    try {
      // Rate limiting
      await rateLimitFriendRequest(userId);

      // Validate input
      const validatedData = validate(friendRequestSchema, data);

      if (validatedData.friendId === userId) {
        throw new HttpsError('invalid-argument', 'Cannot send friend request to yourself');
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
          throw new HttpsError('already-exists', 'Already friends');
        }
        if (existing.status === 'pending') {
          throw new HttpsError('already-exists', 'Friend request already sent');
        }
      }

      // Create friend request
      const friendRequestId = uuidv4();
      await db.collection('friends').doc(friendRequestId).set({
        id: friendRequestId,
        userId,
        friendId: validatedData.friendId,
        status: 'pending',
        createdAt: FieldValue.serverTimestamp(),
      });

      // Send notification
      const userDoc = await db.collection('users').doc(userId).get();
      const userName = userDoc.data()?.displayName || 'Someone';

      await sendPushNotification(
        validatedData.friendId,
        'New Friend Request',
        `${userName} wants to be your friend`,
        {
          type: 'friend_request',
          friendRequestId,
          userId,
        }
      );

      return {
        success: true,
        friendRequestId,
      };
    } catch (error: any) {
      console.error('Error in sendFriendRequest:', error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError('internal', 'Failed to send friend request');
    }
  }
);

