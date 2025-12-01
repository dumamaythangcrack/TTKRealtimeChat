"use strict";
/**
 * Send Message Callable Function
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const auth_1 = require("../middleware/auth");
const rateLimit_1 = require("../middleware/rateLimit");
const validation_1 = require("../utils/validation");
const firestore_1 = require("../utils/firestore");
const uuid_1 = require("uuid");
exports.sendMessage = (0, https_1.onCall)({
    maxInstances: 100,
    timeoutSeconds: 30,
}, async (request) => {
    const userId = await (0, auth_1.verifyAuth)(request);
    const data = request.data;
    try {
        // Rate limiting
        await (0, rateLimit_1.rateLimitMessage)(userId);
        // Validate input
        const validatedData = (0, validation_1.validate)(validation_1.messageSchema, data);
        // Verify user is participant in conversation
        const conversation = await (0, firestore_1.getConversation)(validatedData.conversationId);
        if (!conversation) {
            throw new https_2.HttpsError('not-found', 'Conversation not found');
        }
        const participants = conversation.participants || [];
        if (!participants.includes(userId)) {
            throw new https_2.HttpsError('permission-denied', 'Not a participant in this conversation');
        }
        // Create message
        const messageId = (0, uuid_1.v4)();
        await (0, firestore_1.createMessage)(validatedData.conversationId, messageId, {
            id: messageId,
            conversationId: validatedData.conversationId,
            senderId: userId,
            content: validatedData.content,
            type: validatedData.type,
            replyToId: validatedData.replyToId,
            fileUrl: validatedData.fileUrl,
            metadata: validatedData.metadata,
        });
        return {
            success: true,
            messageId,
        };
    }
    catch (error) {
        console.error('Error in sendMessage:', error);
        if (error instanceof https_2.HttpsError) {
            throw error;
        }
        throw new https_2.HttpsError('internal', 'Failed to send message');
    }
});
//# sourceMappingURL=sendMessage.js.map