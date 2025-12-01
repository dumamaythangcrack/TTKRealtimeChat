"use strict";
/**
 * Authentication Utility Functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCustomClaims = setCustomClaims;
exports.grantAdminPrivileges = grantAdminPrivileges;
exports.revokeAdminPrivileges = revokeAdminPrivileges;
exports.getUserByEmail = getUserByEmail;
exports.verifyIdToken = verifyIdToken;
const auth_1 = require("firebase-admin/auth");
const firestore_1 = require("./firestore");
const auth = (0, auth_1.getAuth)();
/**
 * Set custom claims for user (admin, godMode, etc.)
 */
async function setCustomClaims(userId, claims) {
    try {
        await auth.setCustomUserClaims(userId, claims);
        console.log(`Custom claims set for user ${userId}:`, claims);
    }
    catch (error) {
        console.error('Error setting custom claims:', error);
        throw error;
    }
}
/**
 * Grant admin privileges to user
 */
async function grantAdminPrivileges(userId, isGodMode = false, grantedBy) {
    try {
        const claims = {
            admin: true,
            godMode: isGodMode,
            role: isGodMode ? 'owner' : 'admin',
            permissions: ['*'],
        };
        await setCustomClaims(userId, claims);
        // Log admin action if granted by another admin
        if (grantedBy) {
            await (0, firestore_1.logAdminAction)(grantedBy, 'grant_admin', {
                targetUserId: userId,
                isGodMode,
            });
        }
        return claims;
    }
    catch (error) {
        console.error('Error granting admin privileges:', error);
        throw error;
    }
}
/**
 * Revoke admin privileges
 */
async function revokeAdminPrivileges(userId, revokedBy) {
    try {
        const claims = {
            admin: false,
            godMode: false,
            role: 'user',
            permissions: [],
        };
        await setCustomClaims(userId, claims);
        if (revokedBy) {
            await (0, firestore_1.logAdminAction)(revokedBy, 'revoke_admin', {
                targetUserId: userId,
            });
        }
        return claims;
    }
    catch (error) {
        console.error('Error revoking admin privileges:', error);
        throw error;
    }
}
/**
 * Get user by email
 */
async function getUserByEmail(email) {
    try {
        const user = await auth.getUserByEmail(email);
        return user;
    }
    catch (error) {
        if (error.code === 'auth/user-not-found') {
            return null;
        }
        throw error;
    }
}
/**
 * Verify ID token
 */
async function verifyIdToken(token) {
    try {
        const decodedToken = await auth.verifyIdToken(token);
        return decodedToken;
    }
    catch (error) {
        console.error('Error verifying ID token:', error);
        throw error;
    }
}
//# sourceMappingURL=auth.js.map