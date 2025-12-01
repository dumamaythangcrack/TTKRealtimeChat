"use strict";
/**
 * Authentication Middleware for Cloud Functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = verifyAuth;
exports.verifyAdmin = verifyAdmin;
exports.verifyGodMode = verifyGodMode;
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
exports.requireGodMode = requireGodMode;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("../utils/firestore");
/**
 * Verify authentication token
 */
async function verifyAuth(context) {
    if (!context.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    return context.auth.uid;
}
/**
 * Verify admin access
 */
async function verifyAdmin(userId) {
    const admin = await (0, firestore_1.isAdmin)(userId);
    if (!admin) {
        throw new https_1.HttpsError('permission-denied', 'Admin access required');
    }
}
/**
 * Verify god mode access
 */
async function verifyGodMode(userId) {
    const god = await (0, firestore_1.isGodMode)(userId);
    if (!god) {
        throw new https_1.HttpsError('permission-denied', 'God mode access required');
    }
}
/**
 * Middleware wrapper for authenticated functions
 */
function requireAuth(handler) {
    return async (data, context) => {
        const userId = await verifyAuth(context);
        return handler(userId, data);
    };
}
/**
 * Middleware wrapper for admin-only functions
 */
function requireAdmin(handler) {
    return async (data, context) => {
        const userId = await verifyAuth(context);
        await verifyAdmin(userId);
        return handler(userId, data);
    };
}
/**
 * Middleware wrapper for god mode functions
 */
function requireGodMode(handler) {
    return async (data, context) => {
        const userId = await verifyAuth(context);
        await verifyGodMode(userId);
        return handler(userId, data);
    };
}
//# sourceMappingURL=auth.js.map