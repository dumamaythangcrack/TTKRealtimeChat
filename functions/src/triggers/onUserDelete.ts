/**
 * User Deletion Trigger
 * Cleanup user data when account is deleted
 */

import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const db = getFirestore();
const auth = getAuth();

export const onUserDelete = onDocumentDeleted(
  'users/{userId}',
  async (event) => {
    const userId = event.data?.id;

    if (!userId) {
      console.error('Invalid user ID');
      return;
    }

    console.log(`User deleted: ${userId}`);

    try {
      // Delete user's conversations (soft delete - mark as deleted)
      const conversationsSnapshot = await db
        .collection('conversations')
        .where('participants', 'array-contains', userId)
        .get();

      const conversationUpdates = conversationsSnapshot.docs.map((doc) =>
        doc.ref.update({
          deleted: true,
          deletedAt: new Date(),
        })
      );

      await Promise.all(conversationUpdates);

      // Delete user's stories
      const storiesSnapshot = await db
        .collection('stories')
        .where('userId', '==', userId)
        .get();

      const storyDeletes = storiesSnapshot.docs.map((doc) => doc.ref.delete());
      await Promise.all(storyDeletes);

      // Remove user from groups
      const groupsSnapshot = await db
        .collection('groups')
        .where('members', 'array-contains', userId)
        .get();

      const groupUpdates = groupsSnapshot.docs.map((doc) => {
        const data = doc.data();
        const members = (data.members || []).filter((id: string) => id !== userId);
        const admins = (data.admins || []).filter((id: string) => id !== userId);

        return doc.ref.update({
          members,
          admins,
          memberCount: members.length,
        });
      });

      await Promise.all(groupUpdates);

      // Delete friend relationships
      const friendsSnapshot = await db
        .collection('friends')
        .where('userId', '==', userId)
        .get();

      const friendDeletes = friendsSnapshot.docs.map((doc) => doc.ref.delete());
      await Promise.all(friendDeletes);

      // Delete reverse friend relationships
      const reverseFriendsSnapshot = await db
        .collection('friends')
        .where('friendId', '==', userId)
        .get();

      const reverseFriendDeletes = reverseFriendsSnapshot.docs.map((doc) =>
        doc.ref.delete()
      );
      await Promise.all(reverseFriendDeletes);

      console.log(`User cleanup completed for ${userId}`);
    } catch (error) {
      console.error('Error in onUserDelete:', error);
      throw error;
    }
  }
);

