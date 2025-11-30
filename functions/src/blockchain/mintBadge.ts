/**
 * Mint Badge Function (NFT Badge Minting)
 */

import { onCall } from 'firebase-functions/v2/https';
import { HttpsError } from 'firebase-functions/v2/https';
import { requireAdmin } from '../middleware/auth';

export const mintBadge = onCall(
  {
    maxInstances: 10,
    timeoutSeconds: 60,
  },
  async (request) => {
    const userId = await requireAdmin(request);
    const { recipientId, badgeType, metadata } = request.data;

    if (!recipientId || !badgeType) {
      throw new HttpsError('invalid-argument', 'Recipient ID and badge type are required');
    }

    try {
      // Placeholder for NFT badge minting
      // Would mint NFT on blockchain
      
      return {
        success: true,
        badgeId: 'minted-badge-id',
        recipientId,
        badgeType,
      };
    } catch (error: any) {
      console.error('Error in mintBadge:', error);
      throw new HttpsError('internal', 'Failed to mint badge');
    }
  }
);

