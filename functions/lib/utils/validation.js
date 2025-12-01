"use strict";
/**
 * Validation Utility Functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportSchema = exports.friendRequestSchema = exports.groupSchema = exports.messageSchema = void 0;
exports.validate = validate;
exports.sanitizeInput = sanitizeInput;
const zod_1 = require("zod");
/**
 * Message validation schema
 */
exports.messageSchema = zod_1.z.object({
    conversationId: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1).max(10000),
    type: zod_1.z.enum(['text', 'image', 'video', 'audio', 'file', 'sticker', 'gif', 'location', 'contact', 'poll']),
    replyToId: zod_1.z.string().optional(),
    fileUrl: zod_1.z.string().url().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Group creation validation schema
 */
exports.groupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().max(500).optional(),
    privacy: zod_1.z.enum(['public', 'private', 'invite_only']),
    avatar: zod_1.z.string().url().optional(),
    memberIds: zod_1.z.array(zod_1.z.string()).min(1).max(256),
});
/**
 * Friend request validation schema
 */
exports.friendRequestSchema = zod_1.z.object({
    friendId: zod_1.z.string().min(1),
});
/**
 * Report content validation schema
 */
exports.reportSchema = zod_1.z.object({
    targetType: zod_1.z.enum(['message', 'user', 'group', 'story']),
    targetId: zod_1.z.string().min(1),
    reason: zod_1.z.enum(['spam', 'harassment', 'inappropriate', 'fake', 'other']),
    description: zod_1.z.string().max(1000).optional(),
});
/**
 * Validate data against schema
 */
function validate(schema, data) {
    try {
        return schema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(', ')}`);
        }
        throw error;
    }
}
/**
 * Sanitize string input (prevent XSS)
 */
function sanitizeInput(input) {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}
//# sourceMappingURL=validation.js.map