"use strict";
/**
 * Mint Badge Function (NFT Badge Minting)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintBadge = void 0;
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const auth_1 = require("../middleware/auth");
exports.mintBadge = (0, https_1.onCall)({
    maxInstances: 10,
    timeoutSeconds: 60,
}, async (request) => {
    const userId = await (0, auth_1.requireAdmin)(request);
    const { recipientId, badgeType, metadata } = request.data;
    if (!recipientId || !badgeType) {
        throw new https_2.HttpsError('invalid-argument', 'Recipient ID and badge type are required');
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
    }
    catch (error) {
        console.error('Error in mintBadge:', error);
        throw new https_2.HttpsError('internal', 'Failed to mint badge');
    }
});
//# sourceMappingURL=mintBadge.js.map