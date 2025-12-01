"use strict";
/**
 * Group Create Trigger
 * Handle group creation and initial setup
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.onGroupCreate = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const firestore_2 = require("firebase-admin/firestore");
const notification_1 = require("../utils/notification");
const db = (0, firestore_2.getFirestore)();
exports.onGroupCreate = (0, firestore_1.onDocumentCreated)('groups/{groupId}', async (event) => {
    const groupId = event.data?.id;
    const groupData = event.data?.data();
    if (!groupData) {
        console.error('Invalid group data');
        return;
    }
    const ownerId = groupData.ownerId;
    const members = (groupData.members || []);
    const groupName = groupData.name;
    console.log(`New group created: ${groupId} by ${ownerId}`);
    try {
        // Get owner info
        const ownerDoc = await db.collection('users').doc(ownerId).get();
        const ownerData = ownerDoc.data();
        const ownerName = ownerData?.displayName || 'Someone';
        // Send notifications to all members except owner
        const recipients = members.filter((id) => id !== ownerId);
        const notificationPromises = recipients.map((memberId) => (0, notification_1.sendPushNotification)(memberId, 'You were added to a group', `${ownerName} added you to "${groupName}"`, {
            type: 'group',
            groupId,
        }).catch((error) => {
            console.error(`Failed to send group notification to ${memberId}:`, error);
            return null;
        }));
        await Promise.allSettled(notificationPromises);
        console.log(`Group notifications sent for ${groupId}`);
    }
    catch (error) {
        console.error('Error in onGroupCreate:', error);
        // Don't throw - notification failures shouldn't break group creation
    }
});
//# sourceMappingURL=onGroupCreate.js.map