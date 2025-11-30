/**
 * Story Create Trigger
 * Handle story creation and notifications to followers
 */

import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { sendPushNotification } from '../utils/notification';

const db = getFirestore();

export const onStoryCreate = onDocumentCreated(
  'stories/{storyId}',
  async (event) => {
    const storyId = event.data?.id;
    const storyData = event.data?.data();

    if (!storyData) {
      console.error('Invalid story data');
      return;
    }

    const userId = storyData.userId as string;
    const privacy = storyData.privacy as string;

    console.log(`New story created: ${storyId} by ${userId}`);

    try {
      // Only notify if story is public or friends-only
      if (privacy === 'private') {
        console.log('Story is private, skipping notifications');
        return;
      }

      // Get user info
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      const userName = userData?.displayName || 'Someone';

      // Get user's friends
      const friendsSnapshot = await db
        .collection('friends')
        .where('userId', '==', userId)
        .where('status', '==', 'accepted')
        .get();

      const friendIds = friendsSnapshot.docs.map((doc) => doc.data().friendId);

      // Send notifications to friends
      const notificationPromises = friendIds.map((friendId) =>
        sendPushNotification(
          friendId,
          `${userName} posted a new story`,
          'Tap to view',
          {
            type: 'story',
            storyId,
            userId,
          }
        ).catch((error) => {
          console.error(`Failed to send story notification to ${friendId}:`, error);
          return null;
        })
      );

      await Promise.allSettled(notificationPromises);

      console.log(`Story notifications sent for ${storyId}`);
    } catch (error) {
      console.error('Error in onStoryCreate:', error);
      // Don't throw - notification failures shouldn't break story creation
    }
  }
);

