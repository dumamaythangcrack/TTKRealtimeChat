"use strict";
/**
 * Notification Utility Functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPushNotification = sendPushNotification;
exports.sendBulkNotifications = sendBulkNotifications;
exports.sendMessageNotification = sendMessageNotification;
exports.sendCallNotification = sendCallNotification;
const messaging_1 = require("firebase-admin/messaging");
const firestore_1 = require("./firestore");
const messaging = (0, messaging_1.getMessaging)();
/**
 * Send FCM push notification
 */
async function sendPushNotification(userId, title, body, data) {
    try {
        const user = await (0, firestore_1.getUser)(userId);
        if (!user || !user.fcmToken) {
            console.log(`User ${userId} has no FCM token`);
            return;
        }
        const message = {
            token: user.fcmToken,
            notification: {
                title,
                body,
            },
            data: data || {},
            android: {
                priority: 'high',
                notification: {
                    sound: 'default',
                    channelId: 'chatttk_notifications',
                },
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                        badge: 1,
                    },
                },
            },
        };
        const response = await messaging.send(message);
        console.log('Push notification sent:', response);
        return response;
    }
    catch (error) {
        console.error('Error sending push notification:', error);
        // Don't throw - notification failures shouldn't break the flow
        if (error.code === 'messaging/registration-token-not-registered') {
            // Token is invalid, should be removed from user document
            console.log(`Invalid FCM token for user ${userId}`);
        }
    }
}
/**
 * Send notification to multiple users
 */
async function sendBulkNotifications(userIds, title, body, data) {
    const promises = userIds.map((userId) => sendPushNotification(userId, title, body, data).catch((error) => {
        console.error(`Failed to send notification to ${userId}:`, error);
        return null;
    }));
    await Promise.allSettled(promises);
}
/**
 * Send message notification
 */
async function sendMessageNotification(recipientId, senderName, messageContent, conversationId) {
    return sendPushNotification(recipientId, senderName, messageContent.length > 100 ? messageContent.substring(0, 100) + '...' : messageContent, {
        type: 'message',
        conversationId,
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
    });
}
/**
 * Send call notification
 */
async function sendCallNotification(recipientId, callerName, callId, isVideo) {
    return sendPushNotification(recipientId, 'Incoming Call', `${callerName} is calling you`, {
        type: 'call',
        callId,
        isVideo: isVideo.toString(),
    });
}
//# sourceMappingURL=notification.js.map