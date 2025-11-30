/**
 * Validation Schemas (Zod)
 */

import { z } from 'zod';

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

/**
 * Register schema
 */
export const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  displayName: z.string().min(2, 'Tên hiển thị phải có ít nhất 2 ký tự'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword'],
});

/**
 * Message schema
 */
export const messageSchema = z.object({
  content: z.string().min(1, 'Nội dung không được để trống'),
  type: z.enum(['text', 'image', 'video', 'audio', 'file', 'sticker', 'gif']),
  replyToId: z.string().optional(),
});

/**
 * Group creation schema
 */
export const groupSchema = z.object({
  name: z.string().min(1, 'Tên nhóm không được để trống').max(100, 'Tên nhóm quá dài'),
  description: z.string().max(500, 'Mô tả quá dài').optional(),
  privacy: z.enum(['public', 'private', 'invite_only']),
  memberIds: z.array(z.string()).min(1, 'Phải có ít nhất 1 thành viên'),
});

/**
 * Profile update schema
 */
export const profileSchema = z.object({
  displayName: z.string().min(2, 'Tên hiển thị phải có ít nhất 2 ký tự').max(50),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
});

