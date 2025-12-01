"use strict";
/**
 * Purchase Item Callable Function
 * Handle in-app purchases (coins, items, etc.)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseItem = void 0;
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const auth_1 = require("../middleware/auth");
const firestore_1 = require("firebase-admin/firestore");
const zod_1 = require("zod");
const uuid_1 = require("uuid");
const db = (0, firestore_1.getFirestore)();
const purchaseSchema = zod_1.z.object({
    itemId: zod_1.z.string(),
    itemType: zod_1.z.enum(['coins', 'sticker', 'theme', 'badge', 'boost']),
    amount: zod_1.z.number().optional(), // For coins
    price: zod_1.z.number(),
    paymentMethod: zod_1.z.enum(['coins', 'stripe', 'crypto']),
});
exports.purchaseItem = (0, https_1.onCall)({
    maxInstances: 50,
    timeoutSeconds: 30,
}, async (request) => {
    const userId = await (0, auth_1.verifyAuth)(request);
    const data = request.data;
    try {
        // Validate input
        const validatedData = purchaseSchema.parse(data);
        // Get user
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        const userCoins = userData?.stats?.coins || 0;
        // Handle payment
        if (validatedData.paymentMethod === 'coins') {
            if (userCoins < validatedData.price) {
                throw new https_2.HttpsError('failed-precondition', 'Insufficient coins');
            }
            // Deduct coins
            await db.collection('users').doc(userId).update({
                'stats.coins': firestore_1.FieldValue.increment(-validatedData.price),
            });
        }
        else if (validatedData.paymentMethod === 'stripe') {
            // Stripe payment would be handled via webhook
            // For now, just log
            console.log('Stripe payment initiated:', validatedData);
        }
        else if (validatedData.paymentMethod === 'crypto') {
            // Crypto payment would be handled via blockchain function
            // For now, just log
            console.log('Crypto payment initiated:', validatedData);
        }
        // Grant item to user
        const purchaseId = (0, uuid_1.v4)();
        await db.collection('purchases').doc(purchaseId).set({
            id: purchaseId,
            userId,
            itemId: validatedData.itemId,
            itemType: validatedData.itemType,
            amount: validatedData.amount,
            price: validatedData.price,
            paymentMethod: validatedData.paymentMethod,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        });
        // Update user inventory
        if (validatedData.itemType === 'coins') {
            await db.collection('users').doc(userId).update({
                'stats.coins': firestore_1.FieldValue.increment(validatedData.amount || 0),
            });
        }
        else {
            // Add item to user's inventory
            const inventoryField = `inventory.${validatedData.itemType}s`;
            await db.collection('users').doc(userId).update({
                [inventoryField]: firestore_1.FieldValue.arrayUnion(validatedData.itemId),
            });
        }
        return {
            success: true,
            purchaseId,
        };
    }
    catch (error) {
        console.error('Error in purchaseItem:', error);
        if (error instanceof https_2.HttpsError) {
            throw error;
        }
        throw new https_2.HttpsError('internal', 'Failed to process purchase');
    }
});
//# sourceMappingURL=purchaseItem.js.map