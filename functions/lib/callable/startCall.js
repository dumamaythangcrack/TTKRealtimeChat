"use strict";
/**
 * Start Call Callable Function
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCall = void 0;
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const auth_1 = require("../middleware/auth");
const rateLimit_1 = require("../middleware/rateLimit");
const firestore_1 = require("firebase-admin/firestore");
const zod_1 = require("zod");
const uuid_1 = require("uuid");
const db = (0, firestore_1.getFirestore)();
const callSchema = zod_1.z.object({
    participantIds: zod_1.z.array(zod_1.z.string()).min(1).max(50),
    isVideo: zod_1.z.boolean(),
    conversationId: zod_1.z.string().optional(),
});
exports.startCall = (0, https_1.onCall)({
    maxInstances: 100,
    timeoutSeconds: 30,
}, async (request) => {
    const userId = await (0, auth_1.verifyAuth)(request);
    const data = request.data;
    try {
        // Rate limiting
        await (0, rateLimit_1.rateLimitCall)(userId);
        // Validate input
        const validatedData = callSchema.parse(data);
        // Ensure caller is in participants
        const participants = validatedData.participantIds.includes(userId)
            ? validatedData.participantIds
            : [userId, ...validatedData.participantIds];
        // Create call document
        const callId = (0, uuid_1.v4)();
        await db.collection('calls').doc(callId).set({
            id: callId,
            callerId: userId,
            participants,
            isVideo: validatedData.isVideo,
            conversationId: validatedData.conversationId,
            status: 'ringing',
            startedAt: firestore_1.FieldValue.serverTimestamp(),
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        });
        return {
            success: true,
            callId,
        };
    }
    catch (error) {
        console.error('Error in startCall:', error);
        if (error instanceof https_2.HttpsError) {
            throw error;
        }
        throw new https_2.HttpsError('internal', 'Failed to start call');
    }
});
//# sourceMappingURL=startCall.js.map