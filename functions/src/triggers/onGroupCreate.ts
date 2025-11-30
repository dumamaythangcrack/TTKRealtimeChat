/**
 * Group Create Trigger
 * Handle group creation and initial setup
 */

import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { sendPushNotification } from '../utils/notification';

const db = getFirestore();

export const onGroupCreate = onDocumentCreated(
  'groups/{groupId}',
  async (event) => {
    const groupId = event.data?.id;
    const groupData = event.data?.data();

    if (!groupData) {
      console.error('Invalid group data');
      return;
    }

    const ownerId = groupData.ownerId as string;
    const members = (groupData.members || []) as string[];
    const groupName = groupData.name as string;

    console.log(`New group created: ${groupId} by ${ownerId}`);

    try {
      // Get owner info
      const ownerDoc = await db.collection('users').doc(ownerId).get();
      const ownerData = ownerDoc.data();
      const ownerName = ownerData?.displayName || 'Someone';

      // Send notifications to all members except owner
      const recipients = members.filter((id) => id !== ownerId);

      const notificationPromises = recipients.map((memberId) =>
        sendPushNotification(
          memberId,
          'You were added to a group',
          `${ownerName} added you to "${groupName}"`,
          {
            type: 'group',
            groupId,
          }
        ).catch((error) => {
          console.error(`Failed to send group notification to ${memberId}:`, error);
          return null;
        })
      );

      await Promise.allSettled(notificationPromises);

      console.log(`Group notifications sent for ${groupId}`);
    } catch (error) {
      console.error('Error in onGroupCreate:', error);
      // Don't throw - notification failures shouldn't break group creation
    }
  }
);

