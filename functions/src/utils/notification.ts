/**
 * Notification Utility Functions
 */

import { getMessaging } from 'firebase-admin/messaging';
import { getUser } from './firestore';

const messaging = getMessaging();

/**
 * Send FCM push notification
 */
export async function sendPushNotification(
  userId: string,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  try {
    const user = await getUser(userId);
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
        priority: 'high' as const,
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
  } catch (error: any) {
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
export async function sendBulkNotifications(
  userIds: string[],
  title: string,
  body: string,
  data?: Record<string, string>
) {
  const promises = userIds.map((userId) =>
    sendPushNotification(userId, title, body, data).catch((error) => {
      console.error(`Failed to send notification to ${userId}:`, error);
      return null;
    })
  );

  await Promise.allSettled(promises);
}

/**
 * Send message notification
 */
export async function sendMessageNotification(
  recipientId: string,
  senderName: string,
  messageContent: string,
  conversationId: string
) {
  return sendPushNotification(
    recipientId,
    senderName,
    messageContent.length > 100 ? messageContent.substring(0, 100) + '...' : messageContent,
    {
      type: 'message',
      conversationId,
      click_action: 'FLUTTER_NOTIFICATION_CLICK',
    }
  );
}

/**
 * Send call notification
 */
export async function sendCallNotification(
  recipientId: string,
  callerName: string,
  callId: string,
  isVideo: boolean
) {
  return sendPushNotification(
    recipientId,
    'Incoming Call',
    `${callerName} is calling you`,
    {
      type: 'call',
      callId,
      isVideo: isVideo.toString(),
    }
  );
}

