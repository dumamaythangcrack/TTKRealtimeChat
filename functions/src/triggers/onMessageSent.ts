/**
 * Message Sent Trigger
 * Send push notifications when new message is created
 */

import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { sendMessageNotification } from '../utils/notification';
import { contentModeration } from '../ai/contentModeration';

const db = getFirestore();

export const onMessageSent = onDocumentCreated(
  {
    document: 'conversations/{conversationId}/messages/{messageId}',
  },
  async (event) => {
    const messageId = event.data?.id;
    const messageData = event.data?.data();
    const conversationId = event.params.conversationId;

    if (!messageData || !conversationId) {
      console.error('Invalid message data');
      return;
    }

    const senderId = messageData.senderId as string;
    const content = messageData.content as string;
    const type = messageData.type as string;

    console.log(`New message: ${messageId} in conversation ${conversationId}`);

    try {
      // Get conversation to find participants
      const conversationDoc = await db
        .collection('conversations')
        .doc(conversationId)
        .get();

      if (!conversationDoc.exists) {
        console.error('Conversation not found');
        return;
      }

      const conversationData = conversationDoc.data();
      const participants = (conversationData?.participants || []) as string[];

      // Get sender info
      const senderDoc = await db.collection('users').doc(senderId).get();
      const senderData = senderDoc.data();
      const senderName = senderData?.displayName || 'Someone';

      // Send notifications to all participants except sender
      const recipients = participants.filter((id) => id !== senderId);

      // Content moderation for text messages
      if (type === 'text' && content) {
        try {
          const moderationResult = await contentModeration(content);
          
          if (moderationResult.isToxic || moderationResult.isSpam) {
            // Mark message as flagged
            await event.data?.ref.update({
              flagged: true,
              moderationScore: moderationResult.score,
              moderationReason: moderationResult.reason,
            });

            // If highly toxic, don't send notification
            if (moderationResult.score > 0.8) {
              console.log(`Message ${messageId} flagged as highly toxic, skipping notification`);
              return;
            }
          }
        } catch (modError) {
          console.error('Error in content moderation:', modError);
          // Continue with notification even if moderation fails
        }
      }

      // Send push notifications
      const notificationPromises = recipients.map((recipientId) =>
        sendMessageNotification(recipientId, senderName, content, conversationId).catch(
          (error) => {
            console.error(`Failed to send notification to ${recipientId}:`, error);
            return null;
          }
        )
      );

      await Promise.allSettled(notificationPromises);

      console.log(`Notifications sent for message ${messageId}`);
    } catch (error) {
      console.error('Error in onMessageSent:', error);
      // Don't throw - notification failures shouldn't break message creation
    }
  }
);

