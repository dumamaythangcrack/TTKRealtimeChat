"use strict";
/**
 * Rate Limiting Middleware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyRateLimit = applyRateLimit;
exports.rateLimitMessage = rateLimitMessage;
exports.rateLimitCall = rateLimitCall;
exports.rateLimitFriendRequest = rateLimitFriendRequest;
exports.rateLimitReport = rateLimitReport;
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const https_1 = require("firebase-functions/v2/https");
// Rate limiters for different operations
const messageLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 60, // 60 messages
    duration: 60, // per 60 seconds
});
const callLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 10, // 10 calls
    duration: 60, // per 60 seconds
});
const friendRequestLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 20, // 20 friend requests
    duration: 3600, // per hour
});
const reportLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 5, // 5 reports
    duration: 3600, // per hour
});
/**
 * Apply rate limit
 */
async function applyRateLimit(limiter, key, errorMessage = 'Rate limit exceeded') {
    try {
        await limiter.consume(key);
    }
    catch (error) {
        if (error.remainingPoints === 0) {
            throw new https_1.HttpsError('resource-exhausted', errorMessage);
        }
        throw error;
    }
}
/**
 * Rate limit for messages
 */
async function rateLimitMessage(userId) {
    return applyRateLimit(messageLimiter, userId, 'Too many messages. Please wait a moment.');
}
/**
 * Rate limit for calls
 */
async function rateLimitCall(userId) {
    return applyRateLimit(callLimiter, userId, 'Too many calls. Please wait a moment.');
}
/**
 * Rate limit for friend requests
 */
async function rateLimitFriendRequest(userId) {
    return applyRateLimit(friendRequestLimiter, userId, 'Too many friend requests. Please try again later.');
}
/**
 * Rate limit for reports
 */
async function rateLimitReport(userId) {
    return applyRateLimit(reportLimiter, userId, 'Too many reports. Please try again later.');
}
//# sourceMappingURL=rateLimit.js.map