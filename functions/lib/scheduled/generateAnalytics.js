"use strict";
/**
 * Generate Analytics Scheduled Function
 * Aggregate daily analytics data
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAnalytics = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const firestore_1 = require("firebase-admin/firestore");
const db = (0, firestore_1.getFirestore)();
exports.generateAnalytics = (0, scheduler_1.onSchedule)({
    schedule: 'every 24 hours', // Run daily at midnight
    timeZone: 'UTC',
}, async () => {
    console.log('Generating daily analytics...');
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        // Get total users
        const usersSnapshot = await db.collection('users').get();
        const totalUsers = usersSnapshot.size;
        // Get active users (logged in last 24 hours)
        const activeUsersSnapshot = await db
            .collection('users')
            .where('lastSeenAt', '>', yesterday)
            .get();
        const activeUsers = activeUsersSnapshot.size;
        // Get messages sent today
        const messagesSnapshot = await db
            .collectionGroup('messages')
            .where('createdAt', '>', yesterday)
            .get();
        const messagesSent = messagesSnapshot.size;
        // Get new groups created today
        const groupsSnapshot = await db
            .collection('groups')
            .where('createdAt', '>', yesterday)
            .get();
        const newGroups = groupsSnapshot.size;
        // Get new stories created today
        const storiesSnapshot = await db
            .collection('stories')
            .where('createdAt', '>', yesterday)
            .get();
        const newStories = storiesSnapshot.size;
        // Save analytics
        const analyticsId = `daily_${today.toISOString().split('T')[0]}`;
        await db.collection('analytics').doc(analyticsId).set({
            date: today,
            totalUsers,
            activeUsers,
            messagesSent,
            newGroups,
            newStories,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        });
        console.log('Analytics generated:', {
            totalUsers,
            activeUsers,
            messagesSent,
            newGroups,
            newStories,
        });
    }
    catch (error) {
        console.error('Error in generateAnalytics:', error);
        throw error;
    }
});
//# sourceMappingURL=generateAnalytics.js.map