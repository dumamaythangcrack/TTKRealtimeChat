/**
 * Firestore Utility Functions
 */

import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const db = getFirestore();

/**
 * Get user document by ID
 */
export async function getUser(userId: string) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return null;
    }
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

/**
 * Update user document
 */
export async function updateUser(userId: string, data: Record<string, any>) {
  try {
    await db.collection('users').doc(userId).update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Create user document
 */
export async function createUser(userId: string, data: Record<string, any>) {
  try {
    await db.collection('users').doc(userId).set({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Get conversation by ID
 */
export async function getConversation(conversationId: string) {
  try {
    const convDoc = await db.collection('conversations').doc(conversationId).get();
    if (!convDoc.exists) {
      return null;
    }
    return { id: convDoc.id, ...convDoc.data() };
  } catch (error) {
    console.error('Error getting conversation:', error);
    throw error;
  }
}

/**
 * Create message
 */
export async function createMessage(
  conversationId: string,
  messageId: string,
  data: Record<string, any>
) {
  try {
    await db
      .collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .doc(messageId)
      .set({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

    // Update conversation lastMessageAt
    await db.collection('conversations').doc(conversationId).update({
      lastMessageAt: FieldValue.serverTimestamp(),
      lastMessage: {
        content: data.content,
        senderId: data.senderId,
        type: data.type,
      },
    });
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
}

/**
 * Log admin action (audit trail)
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  details: Record<string, any> = {}
) {
  try {
    await db.collection('admin_logs').add({
      adminId,
      action,
      details,
      timestamp: FieldValue.serverTimestamp(),
      ipAddress: details.ipAddress || 'unknown',
      userAgent: details.userAgent || 'unknown',
    });
  } catch (error) {
    console.error('Error logging admin action:', error);
    // Don't throw - logging shouldn't break the main flow
  }
}

/**
 * Check if user is admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const user = await getUser(userId);
    return user?.isAdmin === true || user?.godMode === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Check if user is god mode
 */
export async function isGodMode(userId: string): Promise<boolean> {
  try {
    const user = await getUser(userId);
    return user?.godMode === true;
  } catch (error) {
    console.error('Error checking god mode:', error);
    return false;
  }
}

