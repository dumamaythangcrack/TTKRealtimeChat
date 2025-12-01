"use strict";
/**
 * CRITICAL: Auto Admin Grant Trigger
 * Tự động cấp quyền ADMIN cho email khangnek705@gmail.com khi đăng ký
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUserCreate = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const auth_1 = require("firebase-admin/auth");
const firestore_2 = require("firebase-admin/firestore");
const firestore_3 = require("../utils/firestore");
const auth_2 = require("../utils/auth");
const email_1 = require("../utils/email");
const auth = (0, auth_1.getAuth)();
const db = (0, firestore_2.getFirestore)();
// SUPER ADMIN EMAIL - HARDCODED
const SUPER_ADMIN_EMAIL = 'khangnek705@gmail.com';
exports.onUserCreate = (0, firestore_1.onDocumentCreated)('users/{userId}', async (event) => {
    const userId = event.data?.id;
    const userData = event.data?.data();
    if (!userId || !userData) {
        console.error('Invalid user data');
        return;
    }
    const email = userData.email;
    const displayName = userData.displayName;
    console.log(`New user created: ${userId}, email: ${email}`);
    try {
        // CRITICAL: Check if this is the super admin email
        if (email === SUPER_ADMIN_EMAIL) {
            console.log(`🚨 SUPER ADMIN DETECTED: ${email}`);
            console.log(`Granting GOD MODE privileges to ${userId}`);
            // Grant admin privileges with GOD MODE
            await (0, auth_2.grantAdminPrivileges)(userId, true); // isGodMode = true
            // Update Firestore user document with admin flags
            await db.collection('users').doc(userId).update({
                isAdmin: true,
                godMode: true,
                role: 'owner',
                permissions: ['*'],
                adminGrantedAt: firestore_2.FieldValue.serverTimestamp(),
                adminGrantedBy: 'system',
            });
            // Log admin action
            await (0, firestore_3.logAdminAction)(userId, 'auto_admin_grant', {
                email,
                reason: 'super_admin_email_match',
                godMode: true,
            });
            console.log(`✅ GOD MODE granted to ${email}`);
        }
        else {
            // Regular user - ensure admin flags are false
            await db.collection('users').doc(userId).update({
                isAdmin: false,
                godMode: false,
                role: 'user',
                permissions: [],
            });
        }
        // Send welcome email
        try {
            await (0, email_1.sendWelcomeEmail)(email, displayName);
        }
        catch (emailError) {
            console.error('Error sending welcome email:', emailError);
            // Don't throw - email failure shouldn't break user creation
        }
        // Initialize user stats
        await db.collection('users').doc(userId).update({
            stats: {
                messagesSent: 0,
                callsMade: 0,
                storiesCreated: 0,
                friendsCount: 0,
                coins: 0,
                level: 1,
                xp: 0,
            },
        });
        console.log(`User setup completed for ${userId}`);
    }
    catch (error) {
        console.error('Error in onUserCreate:', error);
        // Don't throw - we don't want to break user creation
    }
});
//# sourceMappingURL=onUserCreate.js.map