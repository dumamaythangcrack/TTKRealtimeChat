"use strict";
/**
 * Report Content Callable Function
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportContent = void 0;
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const auth_1 = require("../middleware/auth");
const rateLimit_1 = require("../middleware/rateLimit");
const validation_1 = require("../utils/validation");
const firestore_1 = require("firebase-admin/firestore");
const email_1 = require("../utils/email");
const uuid_1 = require("uuid");
const db = (0, firestore_1.getFirestore)();
exports.reportContent = (0, https_1.onCall)({
    maxInstances: 50,
    timeoutSeconds: 30,
}, async (request) => {
    const userId = await (0, auth_1.verifyAuth)(request);
    const data = request.data;
    try {
        // Rate limiting
        await (0, rateLimit_1.rateLimitReport)(userId);
        // Validate input
        const validatedData = (0, validation_1.validate)(validation_1.reportSchema, data);
        // Create report
        const reportId = (0, uuid_1.v4)();
        await db.collection('reports').doc(reportId).set({
            id: reportId,
            reporterId: userId,
            targetType: validatedData.targetType,
            targetId: validatedData.targetId,
            reason: validatedData.reason,
            description: validatedData.description || '',
            status: 'pending',
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        });
        // Notify admins (get all admins)
        const adminsSnapshot = await db
            .collection('users')
            .where('isAdmin', '==', true)
            .get();
        const adminEmails = adminsSnapshot.docs
            .map((doc) => doc.data().email)
            .filter(Boolean);
        // Send email to first admin (or all if needed)
        if (adminEmails.length > 0) {
            await (0, email_1.sendAdminNotificationEmail)(adminEmails[0], 'New Content Report', `A new ${validatedData.reason} report has been submitted. Report ID: ${reportId}`);
        }
        return {
            success: true,
            reportId,
        };
    }
    catch (error) {
        console.error('Error in reportContent:', error);
        if (error instanceof https_2.HttpsError) {
            throw error;
        }
        throw new https_2.HttpsError('internal', 'Failed to submit report');
    }
});
//# sourceMappingURL=reportContent.js.map