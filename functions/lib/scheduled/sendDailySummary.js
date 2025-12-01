"use strict";
/**
 * Send Daily Summary Scheduled Function
 * Send daily summary email to admins
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDailySummary = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const firestore_1 = require("firebase-admin/firestore");
const email_1 = require("../utils/email");
const db = (0, firestore_1.getFirestore)();
exports.sendDailySummary = (0, scheduler_1.onSchedule)({
    schedule: 'every 24 hours', // Run daily at 8 AM UTC
    timeZone: 'UTC',
}, async () => {
    console.log('Sending daily summary to admins...');
    try {
        // Get yesterday's analytics
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const analyticsId = `daily_${yesterday.toISOString().split('T')[0]}`;
        const analyticsDoc = await db.collection('analytics').doc(analyticsId).get();
        const analytics = analyticsDoc.data();
        if (!analytics) {
            console.log('No analytics data found for yesterday');
            return;
        }
        // Get pending reports count
        const reportsSnapshot = await db
            .collection('reports')
            .where('status', '==', 'pending')
            .get();
        const pendingReports = reportsSnapshot.size;
        // Get all admins
        const adminsSnapshot = await db
            .collection('users')
            .where('isAdmin', '==', true)
            .get();
        const summary = `
Daily Summary for ${yesterday.toISOString().split('T')[0]}:

📊 Statistics:
- Total Users: ${analytics.totalUsers}
- Active Users: ${analytics.activeUsers}
- Messages Sent: ${analytics.messagesSent}
- New Groups: ${analytics.newGroups}
- New Stories: ${analytics.newStories}

⚠️ Pending Reports: ${pendingReports}

Please review the admin panel for more details.
      `;
        // Send email to all admins
        const emailPromises = adminsSnapshot.docs.map((doc) => {
            const email = doc.data().email;
            if (email) {
                return (0, email_1.sendAdminNotificationEmail)(email, 'Daily Summary - ChatTTK', summary).catch((error) => {
                    console.error(`Failed to send email to ${email}:`, error);
                    return null;
                });
            }
            return null;
        });
        await Promise.allSettled(emailPromises);
        console.log(`Daily summary sent to ${adminsSnapshot.size} admins`);
    }
    catch (error) {
        console.error('Error in sendDailySummary:', error);
        throw error;
    }
});
//# sourceMappingURL=sendDailySummary.js.map