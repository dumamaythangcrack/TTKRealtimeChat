/**
 * Call Start Trigger
 * Handle call initiation and notifications
 */

import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { sendCallNotification } from '../utils/notification';

const db = getFirestore();

export const onCallStart = onDocumentCreated(
  'calls/{callId}',
  async (event) => {
    const callId = event.data?.id;
    const callData = event.data?.data();

    if (!callData) {
      console.error('Invalid call data');
      return;
    }

    const callerId = callData.callerId as string;
    const participants = (callData.participants || []) as string[];
    const isVideo = callData.isVideo as boolean;

    console.log(`New call started: ${callId} by ${callerId}`);

    try {
      // Get caller info
      const callerDoc = await db.collection('users').doc(callerId).get();
      const callerData = callerDoc.data();
      const callerName = callerData?.displayName || 'Someone';

      // Send notifications to all participants except caller
      const recipients = participants.filter((id) => id !== callerId);

      const notificationPromises = recipients.map((recipientId) =>
        sendCallNotification(recipientId, callerName, callId, isVideo).catch(
          (error) => {
            console.error(`Failed to send call notification to ${recipientId}:`, error);
            return null;
          }
        )
      );

      await Promise.allSettled(notificationPromises);

      // Update call status in Realtime Database for real-time updates
      // This would be handled by the client-side code

      console.log(`Call notifications sent for ${callId}`);
    } catch (error) {
      console.error('Error in onCallStart:', error);
      // Don't throw - notification failures shouldn't break call creation
    }
  }
);

