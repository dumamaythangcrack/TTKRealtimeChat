"use strict";
/**
 * Firestore Utility Functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = getUser;
exports.updateUser = updateUser;
exports.createUser = createUser;
exports.getConversation = getConversation;
exports.createMessage = createMessage;
exports.logAdminAction = logAdminAction;
exports.isAdmin = isAdmin;
exports.isGodMode = isGodMode;
const firestore_1 = require("firebase-admin/firestore");
const db = (0, firestore_1.getFirestore)();
/**
 * Get user document by ID
 */
async function getUser(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return null;
        }
        return { id: userDoc.id, ...userDoc.data() };
    }
    catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}
/**
 * Update user document
 */
async function updateUser(userId, data) {
    try {
        await db.collection('users').doc(userId).update({
            ...data,
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
    }
    catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}
/**
 * Create user document
 */
async function createUser(userId, data) {
    try {
        await db.collection('users').doc(userId).set({
            ...data,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
    }
    catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}
/**
 * Get conversation by ID
 */
async function getConversation(conversationId) {
    try {
        const convDoc = await db.collection('conversations').doc(conversationId).get();
        if (!convDoc.exists) {
            return null;
        }
        return { id: convDoc.id, ...convDoc.data() };
    }
    catch (error) {
        console.error('Error getting conversation:', error);
        throw error;
    }
}
/**
 * Create message
 */
async function createMessage(conversationId, messageId, data) {
    try {
        await db
            .collection('conversations')
            .doc(conversationId)
            .collection('messages')
            .doc(messageId)
            .set({
            ...data,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
        // Update conversation lastMessageAt
        await db.collection('conversations').doc(conversationId).update({
            lastMessageAt: firestore_1.FieldValue.serverTimestamp(),
            lastMessage: {
                content: data.content,
                senderId: data.senderId,
                type: data.type,
            },
        });
    }
    catch (error) {
        console.error('Error creating message:', error);
        throw error;
    }
}
/**
 * Log admin action (audit trail)
 */
async function logAdminAction(adminId, action, details = {}) {
    try {
        await db.collection('admin_logs').add({
            adminId,
            action,
            details,
            timestamp: firestore_1.FieldValue.serverTimestamp(),
            ipAddress: details.ipAddress || 'unknown',
            userAgent: details.userAgent || 'unknown',
        });
    }
    catch (error) {
        console.error('Error logging admin action:', error);
        // Don't throw - logging shouldn't break the main flow
    }
}
/**
 * Check if user is admin
 */
async function isAdmin(userId) {
    try {
        const user = await getUser(userId);
        return user?.isAdmin === true || user?.godMode === true;
    }
    catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}
/**
 * Check if user is god mode
 */
async function isGodMode(userId) {
    try {
        const user = await getUser(userId);
        return user?.godMode === true;
    }
    catch (error) {
        console.error('Error checking god mode:', error);
        return false;
    }
}
//# sourceMappingURL=firestore.js.map