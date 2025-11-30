/**
 * Report Content Callable Function
 */

import { onCall } from 'firebase-functions/v2/https';
import { HttpsError } from 'firebase-functions/v2/https';
import { verifyAuth } from '../middleware/auth';
import { rateLimitReport } from '../middleware/rateLimit';
import { validate, reportSchema } from '../utils/validation';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { sendAdminNotificationEmail } from '../utils/email';
import { v4 as uuidv4 } from 'uuid';

const db = getFirestore();

export const reportContent = onCall(
  {
    maxInstances: 50,
    timeoutSeconds: 30,
  },
  async (request) => {
    const userId = await verifyAuth(request);
    const data = request.data;

    try {
      // Rate limiting
      await rateLimitReport(userId);

      // Validate input
      const validatedData = validate(reportSchema, data);

      // Create report
      const reportId = uuidv4();
      await db.collection('reports').doc(reportId).set({
        id: reportId,
        reporterId: userId,
        targetType: validatedData.targetType,
        targetId: validatedData.targetId,
        reason: validatedData.reason,
        description: validatedData.description || '',
        status: 'pending',
        createdAt: FieldValue.serverTimestamp(),
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
        await sendAdminNotificationEmail(
          adminEmails[0],
          'New Content Report',
          `A new ${validatedData.reason} report has been submitted. Report ID: ${reportId}`
        );
      }

      return {
        success: true,
        reportId,
      };
    } catch (error: any) {
      console.error('Error in reportContent:', error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError('internal', 'Failed to submit report');
    }
  }
);

