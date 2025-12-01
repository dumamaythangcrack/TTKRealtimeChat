"use strict";
/**
 * Process Crypto Payment Function
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPayment = void 0;
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const auth_1 = require("../middleware/auth");
exports.processPayment = (0, https_1.onCall)({
    maxInstances: 20,
    timeoutSeconds: 60,
}, async (request) => {
    const userId = await (0, auth_1.verifyAuth)(request);
    const { amount, currency, recipientId, transactionHash } = request.data;
    if (!amount || !currency || !transactionHash) {
        throw new https_2.HttpsError('invalid-argument', 'Amount, currency, and transaction hash are required');
    }
    try {
        // Placeholder for payment processing
        // Would verify transaction on blockchain
        return {
            success: true,
            transactionId: transactionHash,
            amount,
            currency,
        };
    }
    catch (error) {
        console.error('Error in processPayment:', error);
        throw new https_2.HttpsError('internal', 'Failed to process payment');
    }
});
//# sourceMappingURL=processPayment.js.map