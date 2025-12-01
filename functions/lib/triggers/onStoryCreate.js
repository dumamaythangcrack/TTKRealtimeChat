"use strict";
/**
 * Story Create Trigger
 * Handle story creation and notifications to followers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.onStoryCreate = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const firestore_2 = require("firebase-admin/firestore");
const notification_1 = require("../utils/notification");
const db = (0, firestore_2.getFirestore)();
exports.onStoryCreate = (0, firestore_1.onDocumentCreated)('stories/{storyId}', async (event) => {
    const storyId = event.data?.id;
    const storyData = event.data?.data();
    if (!storyData) {
        console.error('Invalid story data');
        return;
    }
    const userId = storyData.userId;
    const privacy = storyData.privacy;
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
        const notificationPromises = friendIds.map((friendId) => (0, notification_1.sendPushNotification)(friendId, `${userName} posted a new story`, 'Tap to view', {
            type: 'story',
            storyId,
            userId,
        }).catch((error) => {
            console.error(`Failed to send story notification to ${friendId}:`, error);
            return null;
        }));
        await Promise.allSettled(notificationPromises);
        console.log(`Story notifications sent for ${storyId}`);
    }
    catch (error) {
        console.error('Error in onStoryCreate:', error);
        // Don't throw - notification failures shouldn't break story creation
    }
});
//# sourceMappingURL=onStoryCreate.js.map