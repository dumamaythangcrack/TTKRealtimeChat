/**
 * Rate Limiting Middleware
 */

import { RateLimiterMemory } from 'rate-limiter-flexible';
import { HttpsError } from 'firebase-functions/v2/https';

// Rate limiters for different operations
const messageLimiter = new RateLimiterMemory({
  points: 60, // 60 messages
  duration: 60, // per 60 seconds
});

const callLimiter = new RateLimiterMemory({
  points: 10, // 10 calls
  duration: 60, // per 60 seconds
});

const friendRequestLimiter = new RateLimiterMemory({
  points: 20, // 20 friend requests
  duration: 3600, // per hour
});

const reportLimiter = new RateLimiterMemory({
  points: 5, // 5 reports
  duration: 3600, // per hour
});

/**
 * Apply rate limit
 */
export async function applyRateLimit(
  limiter: RateLimiterMemory,
  key: string,
  errorMessage: string = 'Rate limit exceeded'
) {
  try {
    await limiter.consume(key);
  } catch (error: any) {
    if (error.remainingPoints === 0) {
      throw new HttpsError('resource-exhausted', errorMessage);
    }
    throw error;
  }
}

/**
 * Rate limit for messages
 */
export async function rateLimitMessage(userId: string) {
  return applyRateLimit(
    messageLimiter,
    userId,
    'Too many messages. Please wait a moment.'
  );
}

/**
 * Rate limit for calls
 */
export async function rateLimitCall(userId: string) {
  return applyRateLimit(
    callLimiter,
    userId,
    'Too many calls. Please wait a moment.'
  );
}

/**
 * Rate limit for friend requests
 */
export async function rateLimitFriendRequest(userId: string) {
  return applyRateLimit(
    friendRequestLimiter,
    userId,
    'Too many friend requests. Please try again later.'
  );
}

/**
 * Rate limit for reports
 */
export async function rateLimitReport(userId: string) {
  return applyRateLimit(
    reportLimiter,
    userId,
    'Too many reports. Please try again later.'
  );
}

