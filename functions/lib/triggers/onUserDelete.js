"use strict";
/**
 * User Deletion Trigger
 * Cleanup user data when account is deleted
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUserDelete = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const firestore_2 = require("firebase-admin/firestore");
const auth_1 = require("firebase-admin/auth");
const db = (0, firestore_2.getFirestore)();
const auth = (0, auth_1.getAuth)();
exports.onUserDelete = (0, firestore_1.onDocumentDeleted)('users/{userId}', async (event) => {
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
        const conversationUpdates = conversationsSnapshot.docs.map((doc) => doc.ref.update({
            deleted: true,
            deletedAt: new Date(),
        }));
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
            const members = (data.members || []).filter((id) => id !== userId);
            const admins = (data.admins || []).filter((id) => id !== userId);
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
        const reverseFriendDeletes = reverseFriendsSnapshot.docs.map((doc) => doc.ref.delete());
        await Promise.all(reverseFriendDeletes);
        console.log(`User cleanup completed for ${userId}`);
    }
    catch (error) {
        console.error('Error in onUserDelete:', error);
        throw error;
    }
});
//# sourceMappingURL=onUserDelete.js.map