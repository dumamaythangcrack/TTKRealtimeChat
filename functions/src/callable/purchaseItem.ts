/**
 * Purchase Item Callable Function
 * Handle in-app purchases (coins, items, etc.)
 */

import { onCall } from 'firebase-functions/v2/https';
import { HttpsError } from 'firebase-functions/v2/https';
import { verifyAuth } from '../middleware/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const db = getFirestore();

const purchaseSchema = z.object({
  itemId: z.string(),
  itemType: z.enum(['coins', 'sticker', 'theme', 'badge', 'boost']),
  amount: z.number().optional(), // For coins
  price: z.number(),
  paymentMethod: z.enum(['coins', 'stripe', 'crypto']),
});

export const purchaseItem = onCall(
  {
    maxInstances: 50,
    timeoutSeconds: 30,
  },
  async (request) => {
    const userId = await verifyAuth(request);
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
          throw new HttpsError('failed-precondition', 'Insufficient coins');
        }

        // Deduct coins
        await db.collection('users').doc(userId).update({
          'stats.coins': FieldValue.increment(-validatedData.price),
        });
      } else if (validatedData.paymentMethod === 'stripe') {
        // Stripe payment would be handled via webhook
        // For now, just log
        console.log('Stripe payment initiated:', validatedData);
      } else if (validatedData.paymentMethod === 'crypto') {
        // Crypto payment would be handled via blockchain function
        // For now, just log
        console.log('Crypto payment initiated:', validatedData);
      }

      // Grant item to user
      const purchaseId = uuidv4();
      await db.collection('purchases').doc(purchaseId).set({
        id: purchaseId,
        userId,
        itemId: validatedData.itemId,
        itemType: validatedData.itemType,
        amount: validatedData.amount,
        price: validatedData.price,
        paymentMethod: validatedData.paymentMethod,
        createdAt: FieldValue.serverTimestamp(),
      });

      // Update user inventory
      if (validatedData.itemType === 'coins') {
        await db.collection('users').doc(userId).update({
          'stats.coins': FieldValue.increment(validatedData.amount || 0),
        });
      } else {
        // Add item to user's inventory
        const inventoryField = `inventory.${validatedData.itemType}s`;
        await db.collection('users').doc(userId).update({
          [inventoryField]: FieldValue.arrayUnion(validatedData.itemId),
        });
      }

      return {
        success: true,
        purchaseId,
      };
    } catch (error: any) {
      console.error('Error in purchaseItem:', error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError('internal', 'Failed to process purchase');
    }
  }
);

