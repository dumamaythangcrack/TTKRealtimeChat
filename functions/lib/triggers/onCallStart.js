"use strict";
/**
 * Call Start Trigger
 * Handle call initiation and notifications
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.onCallStart = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const firestore_2 = require("firebase-admin/firestore");
const notification_1 = require("../utils/notification");
const db = (0, firestore_2.getFirestore)();
exports.onCallStart = (0, firestore_1.onDocumentCreated)('calls/{callId}', async (event) => {
    const callId = event.data?.id;
    const callData = event.data?.data();
    if (!callData) {
        console.error('Invalid call data');
        return;
    }
    const callerId = callData.callerId;
    const participants = (callData.participants || []);
    const isVideo = callData.isVideo;
    console.log(`New call started: ${callId} by ${callerId}`);
    try {
        // Get caller info
        const callerDoc = await db.collection('users').doc(callerId).get();
        const callerData = callerDoc.data();
        const callerName = callerData?.displayName || 'Someone';
        // Send notifications to all participants except caller
        const recipients = participants.filter((id) => id !== callerId);
        const notificationPromises = recipients.map((recipientId) => (0, notification_1.sendCallNotification)(recipientId, callerName, callId, isVideo).catch((error) => {
            console.error(`Failed to send call notification to ${recipientId}:`, error);
            return null;
        }));
        await Promise.allSettled(notificationPromises);
        // Update call status in Realtime Database for real-time updates
        // This would be handled by the client-side code
        console.log(`Call notifications sent for ${callId}`);
    }
    catch (error) {
        console.error('Error in onCallStart:', error);
        // Don't throw - notification failures shouldn't break call creation
    }
});
//# sourceMappingURL=onCallStart.js.map