/**
 * Cleanup Deleted Users Scheduled Function
 * Permanently delete soft-deleted users after 30 days
 */

import { onSchedule } from 'firebase-functions/v2/scheduler';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const db = getFirestore();
const auth = getAuth();

export const cleanupDeletedUsers = onSchedule(
  {
    schedule: 'every 24 hours', // Run daily
    timeZone: 'UTC',
  },
  async () => {
    console.log('Starting deleted users cleanup...');

    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Get all soft-deleted users older than 30 days
      const usersSnapshot = await db
        .collection('users')
        .where('deleted', '==', true)
        .where('deletedAt', '<', thirtyDaysAgo)
        .limit(100) // Process in batches
        .get();

      if (usersSnapshot.empty) {
        console.log('No deleted users to cleanup');
        return;
      }

      // Delete from Firestore and Auth
      const deletePromises = usersSnapshot.docs.map(async (doc) => {
        const userId = doc.id;
        try {
          // Delete from Auth
          await auth.deleteUser(userId);
          // Delete from Firestore
          await doc.ref.delete();
          console.log(`Deleted user ${userId}`);
        } catch (error) {
          console.error(`Error deleting user ${userId}:`, error);
        }
      });

      await Promise.allSettled(deletePromises);

      console.log(`Cleanup completed for ${usersSnapshot.size} users`);
    } catch (error) {
      console.error('Error in cleanupDeletedUsers:', error);
      throw error;
    }
  }
);

