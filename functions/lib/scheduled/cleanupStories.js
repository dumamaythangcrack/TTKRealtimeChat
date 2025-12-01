"use strict";
/**
 * Cleanup Stories Scheduled Function
 * Delete stories older than 24 hours
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupStories = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const firestore_1 = require("firebase-admin/firestore");
const db = (0, firestore_1.getFirestore)();
exports.cleanupStories = (0, scheduler_1.onSchedule)({
    schedule: 'every 1 hours', // Run every hour
    timeZone: 'UTC',
}, async () => {
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
    }
    catch (error) {
        console.error('Error in cleanupStories:', error);
        throw error;
    }
});
//# sourceMappingURL=cleanupStories.js.map