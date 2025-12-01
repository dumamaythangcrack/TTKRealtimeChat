"use strict";
/**
 * Message Sent Trigger
 * Send push notifications when new message is created
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageSent = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const firestore_2 = require("firebase-admin/firestore");
const notification_1 = require("../utils/notification");
const contentModeration_1 = require("../ai/contentModeration");
const db = (0, firestore_2.getFirestore)();
exports.onMessageSent = (0, firestore_1.onDocumentCreated)({
    document: 'conversations/{conversationId}/messages/{messageId}',
}, async (event) => {
    const messageId = event.data?.id;
    const messageData = event.data?.data();
    const conversationId = event.params.conversationId;
    if (!messageData || !conversationId) {
        console.error('Invalid message data');
        return;
    }
    const senderId = messageData.senderId;
    const content = messageData.content;
    const type = messageData.type;
    console.log(`New message: ${messageId} in conversation ${conversationId}`);
    try {
        // Get conversation to find participants
        const conversationDoc = await db
            .collection('conversations')
            .doc(conversationId)
            .get();
        if (!conversationDoc.exists) {
            console.error('Conversation not found');
            return;
        }
        const conversationData = conversationDoc.data();
        const participants = (conversationData?.participants || []);
        // Get sender info
        const senderDoc = await db.collection('users').doc(senderId).get();
        const senderData = senderDoc.data();
        const senderName = senderData?.displayName || 'Someone';
        // Send notifications to all participants except sender
        const recipients = participants.filter((id) => id !== senderId);
        // Content moderation for text messages
        if (type === 'text' && content) {
            try {
                const moderationResult = await (0, contentModeration_1.contentModeration)(content);
                if (moderationResult.isToxic || moderationResult.isSpam) {
                    // Mark message as flagged
                    await event.data?.ref.update({
                        flagged: true,
                        moderationScore: moderationResult.score,
                        moderationReason: moderationResult.reason,
                    });
                    // If highly toxic, don't send notification
                    if (moderationResult.score > 0.8) {
                        console.log(`Message ${messageId} flagged as highly toxic, skipping notification`);
                        return;
                    }
                }
            }
            catch (modError) {
                console.error('Error in content moderation:', modError);
                // Continue with notification even if moderation fails
            }
        }
        // Send push notifications
        const notificationPromises = recipients.map((recipientId) => (0, notification_1.sendMessageNotification)(recipientId, senderName, content, conversationId).catch((error) => {
            console.error(`Failed to send notification to ${recipientId}:`, error);
            return null;
        }));
        await Promise.allSettled(notificationPromises);
        console.log(`Notifications sent for message ${messageId}`);
    }
    catch (error) {
        console.error('Error in onMessageSent:', error);
        // Don't throw - notification failures shouldn't break message creation
    }
});
//# sourceMappingURL=onMessageSent.js.map