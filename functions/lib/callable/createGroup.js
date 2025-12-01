"use strict";
/**
 * Create Group Callable Function
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroup = void 0;
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../utils/validation");
const firestore_1 = require("firebase-admin/firestore");
const uuid_1 = require("uuid");
const db = (0, firestore_1.getFirestore)();
exports.createGroup = (0, https_1.onCall)({
    maxInstances: 50,
    timeoutSeconds: 30,
}, async (request) => {
    const userId = await (0, auth_1.verifyAuth)(request);
    const data = request.data;
    try {
        // Validate input
        const validatedData = (0, validation_1.validate)(validation_1.groupSchema, data);
        // Ensure owner is in members list
        if (!validatedData.memberIds.includes(userId)) {
            validatedData.memberIds.push(userId);
        }
        // Create group
        const groupId = (0, uuid_1.v4)();
        await db.collection('groups').doc(groupId).set({
            id: groupId,
            name: validatedData.name,
            description: validatedData.description || '',
            privacy: validatedData.privacy,
            avatar: validatedData.avatar || '',
            ownerId: userId,
            admins: [userId],
            members: validatedData.memberIds,
            memberCount: validatedData.memberIds.length,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
        // Create conversation for group
        const conversationId = (0, uuid_1.v4)();
        await db.collection('conversations').doc(conversationId).set({
            id: conversationId,
            type: 'group',
            groupId,
            participants: validatedData.memberIds,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            lastMessageAt: firestore_1.FieldValue.serverTimestamp(),
        });
        return {
            success: true,
            groupId,
            conversationId,
        };
    }
    catch (error) {
        console.error('Error in createGroup:', error);
        if (error instanceof https_2.HttpsError) {
            throw error;
        }
        throw new https_2.HttpsError('internal', 'Failed to create group');
    }
});
//# sourceMappingURL=createGroup.js.map