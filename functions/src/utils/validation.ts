/**
 * Validation Utility Functions
 */

import { z } from 'zod';

/**
 * Message validation schema
 */
export const messageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1).max(10000),
  type: z.enum(['text', 'image', 'video', 'audio', 'file', 'sticker', 'gif', 'location', 'contact', 'poll']),
  replyToId: z.string().optional(),
  fileUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Group creation validation schema
 */
export const groupSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  privacy: z.enum(['public', 'private', 'invite_only']),
  avatar: z.string().url().optional(),
  memberIds: z.array(z.string()).min(1).max(256),
});

/**
 * Friend request validation schema
 */
export const friendRequestSchema = z.object({
  friendId: z.string().min(1),
});

/**
 * Report content validation schema
 */
export const reportSchema = z.object({
  targetType: z.enum(['message', 'user', 'group', 'story']),
  targetId: z.string().min(1),
  reason: z.enum(['spam', 'harassment', 'inappropriate', 'fake', 'other']),
  description: z.string().max(1000).optional(),
});

/**
 * Validate data against schema
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(', ')}`);
    }
    throw error;
  }
}

/**
 * Sanitize string input (prevent XSS)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

