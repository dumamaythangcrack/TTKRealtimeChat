/**
 * Start Call Callable Function
 */

import { onCall } from 'firebase-functions/v2/https';
import { HttpsError } from 'firebase-functions/v2/https';
import { verifyAuth } from '../middleware/auth';
import { rateLimitCall } from '../middleware/rateLimit';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const db = getFirestore();

const callSchema = z.object({
  participantIds: z.array(z.string()).min(1).max(50),
  isVideo: z.boolean(),
  conversationId: z.string().optional(),
});

export const startCall = onCall(
  {
    maxInstances: 100,
    timeoutSeconds: 30,
  },
  async (request) => {
    const userId = await verifyAuth(request);
    const data = request.data;

    try {
      // Rate limiting
      await rateLimitCall(userId);

      // Validate input
      const validatedData = callSchema.parse(data);

      // Ensure caller is in participants
      const participants = validatedData.participantIds.includes(userId)
        ? validatedData.participantIds
        : [userId, ...validatedData.participantIds];

      // Create call document
      const callId = uuidv4();
      await db.collection('calls').doc(callId).set({
        id: callId,
        callerId: userId,
        participants,
        isVideo: validatedData.isVideo,
        conversationId: validatedData.conversationId,
        status: 'ringing',
        startedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        callId,
      };
    } catch (error: any) {
      console.error('Error in startCall:', error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError('internal', 'Failed to start call');
    }
  }
);

