"use strict";
/**
 * Verify NFT Function
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyNFT = void 0;
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const auth_1 = require("../middleware/auth");
exports.verifyNFT = (0, https_1.onCall)({
    maxInstances: 20,
    timeoutSeconds: 30,
}, async (request) => {
    const userId = await (0, auth_1.verifyAuth)(request);
    const { contractAddress, tokenId, network } = request.data;
    if (!contractAddress || !tokenId) {
        throw new https_2.HttpsError('invalid-argument', 'Contract address and token ID are required');
    }
    try {
        // Placeholder for NFT verification logic
        // Would check ownership on blockchain
        return {
            success: true,
            verified: true,
            owner: userId,
            contractAddress,
            tokenId,
        };
    }
    catch (error) {
        console.error('Error in verifyNFT:', error);
        throw new https_2.HttpsError('internal', 'Failed to verify NFT');
    }
});
//# sourceMappingURL=verifyNFT.js.map