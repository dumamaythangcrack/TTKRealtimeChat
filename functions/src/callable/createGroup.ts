/**
 * Create Group Callable Function
 */

import { onCall } from 'firebase-functions/v2/https';
import { HttpsError } from 'firebase-functions/v2/https';
import { verifyAuth } from '../middleware/auth';
import { validate, groupSchema } from '../utils/validation';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';

const db = getFirestore();

export const createGroup = onCall(
  {
    maxInstances: 50,
    timeoutSeconds: 30,
  },
  async (request) => {
    const userId = await verifyAuth(request);
    const data = request.data;

    try {
      // Validate input
      const validatedData = validate(groupSchema, data);

      // Ensure owner is in members list
      if (!validatedData.memberIds.includes(userId)) {
        validatedData.memberIds.push(userId);
      }

      // Create group
      const groupId = uuidv4();
      await db.collection('groups').doc(groupId).set({
        id: groupId,
        name: validatedData.name,
        description: validatedData.description || '',
        privacy: validatedData.privacy,
        avatar: validatedData.avatar || '',
        ownerId: userId,
        admins: [userId],
        members: validatedData.memberIds,
        memberCount: validatedData.memberIds.length,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Create conversation for group
      const conversationId = uuidv4();
      await db.collection('conversations').doc(conversationId).set({
        id: conversationId,
        type: 'group',
        groupId,
        participants: validatedData.memberIds,
        createdAt: FieldValue.serverTimestamp(),
        lastMessageAt: FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        groupId,
        conversationId,
      };
    } catch (error: any) {
      console.error('Error in createGroup:', error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError('internal', 'Failed to create group');
    }
  }
);

