/**
 * Cleanup Stories Scheduled Function
 * Delete stories older than 24 hours
 */

import { onSchedule } from 'firebase-functions/v2/scheduler';
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export const cleanupStories = onSchedule(
  {
    schedule: 'every 1 hours', // Run every hour
    timeZone: 'UTC',
  },
  async () => {
    console.log('Starting story cleanup...');

    try {
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Get all stories older than 24 hours
      const storiesSnapshot = await db
        .collection('stories')
        .where('createdAt', '<', twentyFourHoursAgo)
        .limit(500) // Process in batches
        .get();

      if (storiesSnapshot.empty) {
        console.log('No stories to cleanup');
        return;
      }

      const deletePromises = storiesSnapshot.docs.map((doc) => doc.ref.delete());
      await Promise.all(deletePromises);

      console.log(`Cleaned up ${storiesSnapshot.size} stories`);
    } catch (error) {
      console.error('Error in cleanupStories:', error);
      throw error;
    }
  }
);

