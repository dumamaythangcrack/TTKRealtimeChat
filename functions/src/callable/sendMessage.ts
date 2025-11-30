/**
 * Send Message Callable Function
 */

import { onCall } from 'firebase-functions/v2/https';
import { HttpsError } from 'firebase-functions/v2/https';
import { requireAuth, verifyAuth } from '../middleware/auth';
import { rateLimitMessage } from '../middleware/rateLimit';
import { validate, messageSchema } from '../utils/validation';
import { createMessage, getConversation } from '../utils/firestore';
import { v4 as uuidv4 } from 'uuid';

export const sendMessage = onCall(
  {
    maxInstances: 100,
    timeoutSeconds: 30,
  },
  async (request) => {
    const userId = await verifyAuth(request);
    const data = request.data;

    try {
      // Rate limiting
      await rateLimitMessage(userId);

      // Validate input
      const validatedData = validate(messageSchema, data);

      // Verify user is participant in conversation
      const conversation = await getConversation(validatedData.conversationId);
      if (!conversation) {
        throw new HttpsError('not-found', 'Conversation not found');
      }

      const participants = conversation.participants || [];
      if (!participants.includes(userId)) {
        throw new HttpsError('permission-denied', 'Not a participant in this conversation');
      }

      // Create message
      const messageId = uuidv4();
      await createMessage(validatedData.conversationId, messageId, {
        id: messageId,
        conversationId: validatedData.conversationId,
        senderId: userId,
        content: validatedData.content,
        type: validatedData.type,
        replyToId: validatedData.replyToId,
        fileUrl: validatedData.fileUrl,
        metadata: validatedData.metadata,
      });

      return {
        success: true,
        messageId,
      };
    } catch (error: any) {
      console.error('Error in sendMessage:', error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError('internal', 'Failed to send message');
    }
  }
);

